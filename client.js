// ------------------------------------------------------------------
// Experiment parameters
// ------------------------------------------------------------------

var port = 9000; // Port number should match with server.js
var experiment_timer = 60; // Time to complete experiment (minutes)
var max_length = 16; // Maximum signal length (characters)
var feedback_time = 4; // Length of time to show feedback (seconds)

// ------------------------------------------------------------------
// Array item highlight colors (border and fill)
// ------------------------------------------------------------------

var blue = ['#03A7FF', '#CDEDFF'];
var yellow = ['#FFB200', '#FFEFCB'];
var red = ['#FF2F00', '#FFD5CC'];
var gray = ['#000000', '#EFEFEF'];
var white = ['#000000', '#FFFFFF'];

// ------------------------------------------------------------------
// Initialize global variables
// ------------------------------------------------------------------

var world_key; // The world key is shared with your partner
var partner_id; // Client ID of your partner
var current_role; // Current role: either director or matcher
var target_picture; // Index for the target item in the array
var matcher_mapping; // Mapping between matcher's and director's context
var temp_matcher_selection; // Matcher's temporarily selected item
var matcher_selection = false; // Matcher's final selection
var director_selection = false; // Director's selection
var allow_drawing = false; // Allow drawing to the sending canvas
var trial_num = 1; // Current trial number
var total_points = 0; // Total number of points accumulated
var canvas_contexts = []; // Stores array context objects
var storage = []; // Global array for temporarily storing drawings
var time_up = false; // Set to true when time is up to prevent new trial

// ------------------------------------------------------------------
// Establish connection to Node.js server
// ------------------------------------------------------------------

var socket = io.connect(location.host + ':' + port);

// ------------------------------------------------------------------
// Set the appropriate tapEvent and prevent page manipulation on iPad
// ------------------------------------------------------------------

var tapEvent = 'click';
if ('ontouchstart' in document) {
  var tapEvent = 'touchstart';
  window.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);
}

// ------------------------------------------------------------------
// Set up sending and receiving canvas contexts
// ------------------------------------------------------------------

var sending_canvas = document.getElementById('sending_canvas');
var sending_context = sending_canvas.getContext('2d');
sending_context.lineJoin = 'round'; sending_context.lineCap = 'round';

var receiving_canvas = document.getElementById('receiving_canvas');
var receiving_context = receiving_canvas.getContext('2d');
receiving_context.lineJoin = 'round'; receiving_context.lineCap = 'round';

// ------------------------------------------------------------------
// General functions
// ------------------------------------------------------------------

// Functions for showing/hiding/enabling/disabling a set of elements
function showElements(elements) { elements.forEach(function(el){ $(el).show(); }); }
function hideElements(elements) { elements.forEach(function(el){ $(el).hide(); }); }
function enableElements(elements) { elements.forEach(function(el){ $(el).attr('disabled', false); }); }
function disableElements(elements) { elements.forEach(function(el){ $(el).attr('disabled', true); }); }

// Make N canvases available in the context array. The canvases are display:none by
// default; this function makes them available and puts the context object in canvas_contexts
function newCanvases(n_required) {
  for (var i=canvas_contexts.length; i<n_required; i++) {
    var canvas = document.getElementById('array_item_'+i);
    var context = canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    canvas_contexts.push(context);
    $('#context_array').css('width', (n_required*4) + (n_required*132) + ((n_required-1)*12))
    $('#array_item_container_'+i).css('display', 'block');
  }
}

// Begin the countdown timer; uses setInterval to refresh ever 200 milliseconds
// comparing the current time to the start time
function beginTimer() {
  var milliseconds = experiment_timer * 60 * 1000
  var start = new Date().getTime();
  var interval = setInterval(function() {
    var now = (milliseconds - (new Date().getTime() - start)) / 1000;
    if (now <= 0) {
      clearInterval(interval);
      time_up = true;
      $('#timer').html('•••');
    }
    else {
      var mins = Math.floor(now / 60);
      var secs = Math.floor(now % 60);
      if (secs < 10) secs = '0' + secs;
      $('#timer').html(mins + ':' + secs);
    }
  }, 200);
}

// Draw a drawing to a given context at a given scale factor
function drawToCanvas(cntx, drawing, scale_factor) {
  cntx.lineWidth = 5 * scale_factor;
  cntx.beginPath();
  cntx.moveTo(drawing[0][0]*scale_factor, drawing[0][1]*scale_factor);
  for (var i=0, n=drawing.length; i<n; i++) {
    if (drawing[i] instanceof Array) cntx.lineTo(drawing[i][0]*scale_factor, drawing[i][1]*scale_factor);
    else {
      cntx.stroke();
      if (drawing[i+1] instanceof Array) cntx.moveTo(drawing[i+1][0]*scale_factor, drawing[i+1][1]*scale_factor);
      i++;
    }
  }
  cntx.stroke();
}

// Remove redundant points from a coordinate sequence. If two consecutive coordinates
// are identical, remove one of them, resulting in a compressed coordinate sequence
function compressDrawing(drawing) {
  var compressed_drawing = ['BREAK'];
  for (var i=0, n=drawing.length; i<n; i++) {
    var m = compressed_drawing.length - 1;
    if (drawing[i] instanceof Array) {
      if (drawing[i][0] != compressed_drawing[m][0] || drawing[i][1] != compressed_drawing[m][1]) compressed_drawing.push(drawing[i]); 
    }
    else if (drawing[i] != compressed_drawing[m]) compressed_drawing.push(drawing[i]);
  }
  return compressed_drawing.slice(1, -1);
}

// Determine a random order for the matcher's context array. n = current context size
function randomMatcherOrder(n) {
  var array = [0,1,2,3,4].slice(0, n);
  var temp, index;
  while (n > 0) {
    index = Math.floor(Math.random() * n);
    n--;
    temp = array[n];
    array[n] = array[index];
    array[index] = temp;
  }
  return array;
}

// Highlight a particular context array item in a particular color
// color is one of the color variables defined above
function highlightArrayItem(item_number, color) {
  $('#array_item_' + item_number).css({'background-color': color[1]});
  $('#array_item_container_' + item_number).css({'border': 'solid ' + color[0] + ' 2px'});
}

// Award points to the player by flashing star in appropriate place. Get the position of the
// array item and add 41 pixels to the top and left coordinate to center the appropriate star
// image over the array item. Then flash the star in and out and update the points total.
function awardPoints(item, points) {
  var points_position = $('#array_item_'+item).offset();
  $('#star').css({'background-image':'url(images/star_'+points+'_points.png)', 'visibility':'visible', 'top':points_position.top+41, 'left':points_position.left+41});
  $('#star').fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(1500);
  if (points > 0) updatePointsTotal(points);
}

// Update the total number of points by a given amount. Every 200 milliseconds, increment
// the points total in the status bar by 1
function updatePointsTotal(new_points) {
  var current_points = total_points;
  total_points += new_points;
  var interval = setInterval(function() {
    if (new_points == 0) clearInterval(interval);
    else {
      current_points++;
      $('#points').html(current_points);
      new_points--;
    }
  }, 200);
}

// Present an instruction in the status bar; optionally set to blue to indicate it's your turn
function giveInstruction(instruction, my_turn) {
  $('#instruction').html(instruction);
  if (my_turn == true) $('#status_bar').css('background-color', '#03A7FF');
  else $('#status_bar').css('background-color', '#000000');
}

// Enable or disable the correct set of keyboard keys. Require more than 0 characters to send,
// clear, or delete. At max_length characters, disable the letter keys
function enableKeyboardKeys() {
  switch ($('#label').val().length) {
    case max_length:
      disableElements(['.key']);
      showElements(['#max_length_warning']);
      return;
    case 0:
      disableElements(['#clear_key', '#delete_key', '#send_key']);
      hideElements(['#max_length_warning']);
      enableElements(['.key']);
      return;
  }
  enableElements(['#clear_key', '#delete_key', '#send_key', '.key']);
  hideElements(['#max_length_warning']);
}

// ------------------------------------------------------------------
// Interface functions
// ------------------------------------------------------------------

// Initialize a new trial for the director. Set up new canvases if necessary. Then iterate over
// the canvas contexts drawing each array item; only make the target item visible. Show the keyboard,
// context array, and message input, and position the pointer below the target item.
function initializeDirector(array_items) {
  var n_array_items = array_items.length;
  if (n_array_items > canvas_contexts.length) newCanvases(n_array_items);
  for (var i=0; i<n_array_items; i++) {
    if (i == target_picture) $('#array_item_'+i).css('visibility', 'visible');
    else $('#array_item_'+i).css('visibility', 'hidden');
    drawToCanvas(canvas_contexts[i], array_items[i], 0.25);
  }
  showElements(['#context_array', '#keyboard', '#message']);
  var pointer_pos = $('#array_item_'+target_picture).offset().left + 29;
  $('#pointer').css({ 'margin-left':pointer_pos+'px', 'visibility':'visible' });
  giveInstruction('Type a description of the visible picture so that your partner can identify it.', true);
}

// Initialize a new trial for the matcher. Set up new canvases if necessary. Determine a random order
// in which to present the array items, so that the director and matcher don't see them in the same
// order. Then iterate over the canvas contexts drawing each array item. Show the context array and
// position the pointer (although don't make it visible just yet).
function initializeMatcher(array_items) {
  var n_array_items = array_items.length;
  matcher_mapping = randomMatcherOrder(n_array_items);
  if (n_array_items > canvas_contexts.length) newCanvases(n_array_items);
  for (var i=0; i<n_array_items; i++) {
    drawToCanvas(canvas_contexts[i], array_items[matcher_mapping[i]], 0.25);
  }
  showElements(['#context_array']);
  var pointer_pos = $('#array_item_' + matcher_mapping.indexOf(target_picture)).offset().left + 29;
  $('#pointer').css({ 'margin-left':pointer_pos+'px' });
  giveInstruction('Waiting for your partner...', false);
}

// Display a signal to the matcher and set matcher_selection to null to allow the matcher to make
// a selection
function displaySignal(signal) {
  matcher_selection = null;
  giveInstruction('Which of the pictures is your partner communicating to you?', true);
  $('#label').val(signal);
  $('#message').fadeIn(500);
}

// Reveal the sending canvas to the matcher so that they can create a drawing; set allow_drawing
// to true
function displayMatcherDrawing() {
  giveInstruction('Now draw the picture for your partner so they know which one you picked.', true);
  showElements(['#sending_canvas']);
  $('#drawing_area').fadeIn(350);
  $('#drawing_functions').fadeIn(350);
  allow_drawing = true;
}

// Draw the received drawing (stored in the global variable storage) to the receiving canvas context
// and then reveal it to the director. Set director_selection to null to permit making a selection
function displayDirectorDrawing() {
  drawToCanvas(receiving_context, storage, 1.0);
  giveInstruction('Which picture has your partner drawn?', true);
  showElements(['#receiving_canvas']);
  $('#drawing_area').fadeIn(350);
  director_selection = null;
}

// Give feedback to the director. Determine the outcome (1, 2, 3, or 4) and color the array items
// accordingly. Emit the director's selection and the outcome to your partner. Then set a timeout of
// N seconds for resetting the interface in preparation for the next trial. Feedback time is set at
// the top of this script 
function directorFeedback() {
  if (target_picture == matcher_selection && matcher_selection == director_selection) {
    highlightArrayItem(target_picture, blue);
    awardPoints(target_picture, 10);
    giveInstruction('You both picked the correct target picture.', false);
    var outcome = 1;
  }
  else if (target_picture != matcher_selection && matcher_selection == director_selection) {
    highlightArrayItem(director_selection, yellow);
    awardPoints(director_selection, 5);
    giveInstruction('You correctly identified the picture that your partner drew.', false);
    var outcome = 2;
  }
  else if (target_picture == matcher_selection && matcher_selection != director_selection) {
    highlightArrayItem(matcher_selection, yellow);
    highlightArrayItem(director_selection, gray);
    awardPoints(matcher_selection, 5);
    giveInstruction('Your partner picked the correct target picture.', false);
    var outcome = 3;
  }
  else {
    highlightArrayItem(matcher_selection, red);
    highlightArrayItem(director_selection, gray);
    giveInstruction('You both picked the wrong picture.', false);
    var outcome = 4;
  }
  socket.emit('send_feedback', { to:partner_id, world_key:world_key, trial_num:trial_num, director_selection:director_selection, outcome:outcome });
  setTimeout(function() {
    resetInterface();
  }, feedback_time * 1000);
}

// Give feedback to the matcher. Determine the outcome (1, 2, 3, or 4) and color the array items
// accordingly. Then set a timeout of N seconds for resetting the interface in preparation for the
// next trial. Feedback time is set at the top of this script 
function matcherFeedback() {
  var mapped_director_selection = matcher_mapping.indexOf(director_selection);
  if (target_picture == matcher_selection && matcher_selection == director_selection) {
    highlightArrayItem(mapped_director_selection, blue);
    awardPoints(mapped_director_selection, 10);
    giveInstruction('You both picked the correct target picture.', false);
  }
  else if (target_picture != matcher_selection && matcher_selection == director_selection) {
    highlightArrayItem(mapped_director_selection, yellow);
    awardPoints(mapped_director_selection, 5);
    giveInstruction('Your partner correctly identified the picture that you drew.', false);
  }
  else if (target_picture == matcher_selection && matcher_selection != director_selection) {
    highlightArrayItem(mapped_director_selection, yellow);
    awardPoints(mapped_director_selection, 5);
    giveInstruction('You picked the correct target picture.', false);
  }
  else {
    highlightArrayItem(mapped_director_selection, red);
    giveInstruction('You both picked the wrong picture.', false);
  }
  setTimeout(function() {
    resetInterface();
  }, feedback_time * 1000);
}

// If time_up is set to true, show the "Experiment Complete" overlay and send a terminate command
// to your partner to ensure that both iPads know the experiment is complete. Otherwise, increment
// the trial number and reset the page elements in preparation for the next trial. If you were the
// matcher on that trial, request a new trial from the server after a one second delay to allow for
// the DOM to be reset on both iPads
function resetInterface() {
  if (time_up == true) {
    $('#time_up').show();
    $('#timer').html('DONE');
    giveInstruction('', false);
    socket.emit('terminate', { to:partner_id });
  }
  else {
    trial_num ++;
    if (current_role == 'matcher') {
      setTimeout(function() {
        socket.emit("request_new_trial", { to:partner_id, world_key:world_key, trial_num:trial_num });
      }, 1000);
    }
    hideElements(['#receiving_canvas', '#sending_canvas', '#context_array', '#message', '#drawing_functions', '#max_length_warning', '#drawing_area']);
    $('#pointer').css({ 'visibility':'hidden' });
    $('#star').css({ 'visibility':'hidden' });
    enableElements(['.key']);
    disableElements(['#send_key', '#delete_key', '#clear_key', '#send_drawing', '#clear_drawing']);
    for (var i=0; i<canvas_contexts.length; i++) {
      highlightArrayItem(i, white, false);
      canvas_contexts[i].clearRect(0, 0, 132, 132);
    }
    receiving_context.clearRect(0, 0, 528, 528);
    sending_context.clearRect(0, 0, 528, 528);
    $('#sending_canvas').sketch('actions', []);
    target_picture = null;
    matcher_selection = false;
    director_selection = false;
    storage = [];
    $('#instruction').html('');
    $('#label').val('');
  }
}

// ------------------------------------------------------------------
// Local event handlers
// ------------------------------------------------------------------

// On page load, hide page elements and set the timer to N minutes
$(document).ready(function() {
  hideElements(['#receiving_canvas', '#sending_canvas', '#context_array', '#message', '#keyboard', '#drawing_functions', '#max_length_warning', '#drawing_area']);
  $('#timer').html(experiment_timer + ':00');
});

// Event handler for the start button. On press, replace the start button with spinner and emit
// register command to the server
$('#start_key').on(tapEvent, function() {
  $('#start_area').html('<img src="images/loading.gif" width="33" height="33" /><p>Waiting for your partner...</p>');
  socket.emit('register');
});

// Event handler for keyboard key presses. On press, determine which key was pressed and update
// the message input. Then call enableKeyboardKeys() to refresh the keyboard
$('button[id^="key_"]').on(tapEvent, function() {
  if ($(this).prop('disabled') == false) {
    $(this).fadeOut(50).fadeIn(50);
    var key = $(this).attr('id').match(/key_(.)/)[1];
    var current_label = $('#label').val();
    if (key == '~') {
      if (current_label.slice(-1) == ' ') key = '';
      else key = ' ';
    }
    $('#label').val(current_label + key);
    enableKeyboardKeys();
  }
});

// Event handler for the send signal button. On press, hide the keyboard, remove trailing spaces,
// and send the signal to your partner. Then reveal the other items in the context array
$('#send_key').on(tapEvent, function() {
  if ($(this).prop('disabled') == false && $('#label').val().length > 0) {
    $('#keyboard').hide();
    var current_label = $('#label').val();
    if (current_label.slice(-1) == ' ') {
      current_label = current_label.slice(0, -1);
      $('#label').val(current_label);
    }
    socket.emit('send_signal', { to:partner_id, world_key:world_key, trial_num:trial_num, signal:current_label });
    giveInstruction('Waiting for your partner...', false);
    for (var i=0; i<canvas_contexts.length; i++) {
      $('#array_item_'+i).css('visibility', 'visible');
    }
  }
});

// Event handler for the delete last character button
$('#delete_key').on(tapEvent, function() {
  if ($(this).prop('disabled') == false) {
    $(this).fadeOut(50).fadeIn(50);
    $('#label').val($('#label').val().slice(0, -1));
    $('.key').attr('disabled', false);
    enableKeyboardKeys();
  }
});

// Event handler for the clear signal button
$('#clear_key').on(tapEvent, function() {
  if ($(this).prop('disabled') == false) {
    $('#label').val('');
    enableKeyboardKeys();
  }
});

// Event handler for the send drawing button. On press, remove the send and clear buttons. Set
// allow_drawing back to false. Use matcher_mapping to reverse the matcher's selection from the
// randomized context array and store in matcher_selection. Compress the drawing and then send it
// with the matcher's selection to the director. Make the pointer visible to reveal the correct
// target
$('#send_drawing').on(tapEvent, function() {
  if ($(this).prop('disabled') == false && storage.length > 0) {
    $('#drawing_functions').hide();
    allow_drawing = false;
    matcher_selection = matcher_mapping[temp_matcher_selection];
    var drawing = compressDrawing(storage);
    socket.emit('send_drawing', { to:partner_id, world_key:world_key, trial_num:trial_num, drawing:drawing, matcher_selection:matcher_selection });
    $('#pointer').css({ 'visibility':'visible' });
    giveInstruction('Waiting for your partner...', false);
  }
});

// Event handler for the clear drawing button. Clear the storage array, wipe the sending canvas, and
// clear the actions array inside the Sketch.js instance.
$('#clear_drawing').on(tapEvent, function() {
  if ($(this).prop('disabled') == false) {
    storage = [];
    sending_context.clearRect(0, 0, 528, 528);
    $('#sending_canvas').sketch('actions', []);
    disableElements(['#send_drawing', '#clear_drawing']);
  }
});

// Event handler for selecting canvases in the matcher array. If you are the matcher and you're allowed
// to make a selection, set the temp_matcher_selection variable and color the canvases in the context
// array appropriately, then call displayMatcherDrawing(). If you're the director and you're allowed to
// make a selection, set the director_selection variable and then call directorFeedback()
$('canvas[id^="array_item_"]').on(tapEvent, function() {
  var selection = parseInt($(this).attr('id').match(/array_item_(.)/)[1]);
  if (current_role == 'matcher' && matcher_selection == null) {
    temp_matcher_selection = selection;
    for (var i=0; i<canvas_contexts.length; i++) {
      $('#array_item_'+i).css({'background-color': '#FFFFFF'});
    }
    $(this).css({'background-color': '#EFEFEF'});
    displayMatcherDrawing();
  }
  if (current_role == 'director' && director_selection == null) {
    director_selection = selection;
    directorFeedback();
  }
});

// ------------------------------------------------------------------
// Server event handlers - how to respond to messages from the server
// ------------------------------------------------------------------

// Server tells you to start the experiment. The server supplies you with your world key, partner's ID,
// current role, and the target item. Store these to global variables. If your the director call the
// initializeDirector() function, else call initializeMatcher(), passing the drawings to be placed in the
// context array. Then start the timer and remove the waiting message
socket.on('start_experiment', function(payload) {
  world_key = payload.world_key
  partner_id = payload.partner_id;
  current_role = payload.role;
  target_picture = payload.target_picture;
  if (current_role == 'director') initializeDirector(payload.array_items);
  else initializeMatcher(payload.array_items);
  beginTimer();
  $('#start_area').hide();
});

// Server tells you to start a new trial. Store your current role and the target item to global variables
// and then pass the array items to initializeDirector() or initializeMatcher()
socket.on('start_new_trial', function(payload) {
  current_role = payload.role;
  target_picture = payload.target_picture;
  if (current_role == 'director') initializeDirector(payload.array_items);
  else initializeMatcher(payload.array_items);
});

// Server passes you a signal. Pass it to displaySignal()
socket.on('receive_signal', function(payload) {
  displaySignal(payload.signal);
});

// Server passes you a drawing and the matcher's selection. Store the selection and drawing and call
// displayDirectorDrawing()
socket.on('receive_drawing', function(payload) {
  matcher_selection = payload.matcher_selection;
  storage = payload.drawing;
  displayDirectorDrawing();
});

// Server passes you feedback from the director. Store the director's selection and call matcherFeedback()
socket.on('receive_feedback', function(payload) {
  director_selection = payload.director_selection;
  matcherFeedback();
});

// Server tells you to terminate the experiment. Display the "Experiment Complete" overlay
socket.on('terminate', function() {
  $('#time_up').show();
  $('#timer').html('DONE');
  giveInstruction('', false);
});

// ------------------------------------------------------------------
// Stripped down adaptation of Sketch.js for the drawing canvas
// Copyright (C) 2011 by Michael Bleigh and Intridea, Inc (MIT License)
// http://intridea.github.io/sketch.js/
// ------------------------------------------------------------------

(function($) {
  $.fn.sketch = function() {
    var sketch = this.data('sketch');
    this.data('sketch', new Sketch(this.get(0)));
    return this;
  };
  var Sketch = (function() {
    function Sketch(el) {
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      this.painting = false;
      this.tool = 'marker';
      this.actions = [];
      this.action = [];
      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
    }
    Sketch.prototype.startPainting = function() {
      if (allow_drawing == true) {
        this.painting = true;
        return this.action = { tool: 'marker', events: [] };
      }
    };
    Sketch.prototype.stopPainting = function() {
      if (this.action) {
        this.actions.push(this.action);
      }
      this.painting = false;
      this.action = null;
      storage.push('BREAK');
      enableElements(['#send_drawing', '#clear_drawing']);
      return this.redraw();
    };
    Sketch.prototype.onEvent = function(e) {
      if (e.originalEvent && e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) {
        e.pageX = e.originalEvent.targetTouches[0].pageX;
        e.pageY = e.originalEvent.targetTouches[0].pageY;
      }
      $.sketch['marker'].onEvent.call($(this).data('sketch'), e);
      e.preventDefault();
      return false;
    };
    Sketch.prototype.redraw = function() {
      var sketch;
      this.el.width = this.canvas.width();
      this.context = this.el.getContext('2d');
      sketch = this;
      $.each(this.actions, function() {
        if (this.tool) {
          return $.sketch['marker'].draw.call(sketch, this);
        }
      });
      if (this.painting && this.action) {
        return $.sketch['marker'].draw.call(sketch, this.action);
      }
    };
    return Sketch;
  })();
  $.sketch = {
    marker: {
      onEvent: function(e) {
        switch (e.type) {
          case 'mousedown':
          case 'touchstart':
            this.startPainting();
            break;
          case 'mouseup':
          case 'mouseout':
          case 'mouseleave':
          case 'touchend':
          case 'touchcancel':
            this.stopPainting();
        }
        if (this.painting) {
          var x_coordinate = e.pageX - this.canvas.offset().left;
          var y_coordinate = e.pageY - this.canvas.offset().top;
          this.action.events.push({ x: x_coordinate, y: y_coordinate, event: e.type });
          storage.push([parseInt(x_coordinate), parseInt(y_coordinate)]);
          return this.redraw();
        }
      },
      draw: function(action) {
        var event, previous, _i, _len, _ref;
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.context.moveTo(action.events[0].x, action.events[0].y);
        _ref = action.events;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          this.context.lineTo(event.x, event.y);
          previous = event;
        }
        this.context.strokeStyle = '#000000';
        this.context.lineWidth = 5;
        return this.context.stroke();
      }
    }
  };
})(jQuery);
$('#sending_canvas').sketch();
