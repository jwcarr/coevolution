// ------------------------------------------------------------------
// Initialize global variables
// ------------------------------------------------------------------

// Empty associative array for holding the worlds.
// Takes the form of { 'world_key_1' : [item1, item2, etc...], 'world_key_2': [item1, item2, etc...], etc... }
var worlds = {};

// Hold the ID of the currently waiting client until they're paired with another client. Then reset back to 'null'.
var queued_client_ID = null;

// Port number should match with client.js
var port = 9000;

// ------------------------------------------------------------------
// Seed drawings
// ------------------------------------------------------------------

// A drawing is an array of x- and y-coordinates.
var circle = [[464,264], [463,283], [460,303], [455,323], [448,341], [439,359], [429,376], [416,392], [403,407], [388,420], [372,432], [354,442], [336,450], [317,456], [297,461], [278,463], [258,463], [238,462], [218,458], [199,453], [180,445], [163,436], [146,425], [130,413], [116,399], [103,383], [92,367], [83,349], [75,330], [69,311], [66,292], [64,272], [64,252], [66,232], [70,212], [76,193], [84,175], [94,158], [105,141], [118,126], [133,112], [149,100], [165,89], [183,80], [202,73], [221,68], [241,65], [261,64], [281,64], [301,67], [320,72], [339,78], [357,87], [374,97], [390,109], [405,122], [419,137], [430,153], [441,171], [449,189], [456,208], [460,227], [464,264]];
var triangle = [[60,440], [468,440], [264,87], [60,440]];
var diamond = [[264,60], [408,264], [264,468], [120,264], [264,60]];

// The seeds for each new session
var seeds = [circle, triangle, diamond];

// ------------------------------------------------------------------
// Initialize the Node.js server
// ------------------------------------------------------------------

var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// ------------------------------------------------------------------
// Global functions
// ------------------------------------------------------------------

// Error handling callback
var errorCallback = function(err) { if (err) return console.log(err) };

// Select a random set of context items and a random target for a given world
function randomizeNewTrial(world_key) {
  var total_n = worlds[world_key].length, n_array_items = worlds[world_key].length, indices = [], array_items = [];
  if (n_array_items > 5) n_array_items = 5;
  while (indices.length < n_array_items) {
    var num = Math.floor(Math.random() * total_n);
    if (indices.indexOf(num) == -1) indices.push(num);
  }
  for (var i=0; i<n_array_items; i++) {
    array_items.push(worlds[world_key][indices[i]]);
  }
  var random_target = Math.floor(Math.random() * n_array_items);
  return [array_items, indices, random_target];
}

// ------------------------------------------------------------------
// Client event handlers - how to respond to messages from a client
// ------------------------------------------------------------------

io.sockets.on('connection', function(client) {


  // Client asks to register with the server
  client.on('register', function() {
    if (queued_client_ID == null) queued_client_ID = client.id;
    else {
      var partner_id = queued_client_ID;
      queued_client_ID = null;
      var world_key = partner_id + client.id;
      worlds[world_key] = seeds.slice();
      var trial = randomizeNewTrial(world_key);
      io.sockets.connected[partner_id].emit('start_experiment', { role:'director', partner_id:client.id, world_key:world_key, array_items:trial[0], target_picture:trial[2] });
      io.sockets.connected[client.id].emit('start_experiment', { role:'matcher', partner_id:partner_id, world_key:world_key, array_items:trial[0], target_picture:trial[2] });
      var log = 'Trial: 1\nContext IDs: ' + trial[1] + '\nTarget item: ' + trial[2] + '\n';
      fs.mkdir('../../server_data/coevolution/' + world_key + '/', function(err) {
        if (err) return console.log(err);
        fs.writeFile('../../server_data/coevolution/' + world_key + '/1', log, errorCallback);
      });
    }
  });


  // Client asks you to pass a signal to another client
  client.on('send_signal', function(payload) {
    io.sockets.connected[payload.to].emit('receive_signal', payload);
    var log = 'Signal: ' + payload.signal + '\n';
    fs.appendFile('../../server_data/coevolution/' + payload.world_key + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to pass a drawing to another client
  client.on('send_drawing', function(payload) {
    io.sockets.connected[payload.to].emit('receive_drawing', payload);
    worlds[payload.world_key].push(payload.drawing);
    var log = 'Matcher selection: ' + payload.matcher_selection + '\nDrawing: ' + payload.drawing.join('; ') + '\n';
    fs.appendFile('../../server_data/coevolution/' + payload.world_key + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to pass feedback to another client
  client.on('send_feedback', function(payload) {
    io.sockets.connected[payload.to].emit('receive_feedback', payload);
    var log = 'Director selection: ' + payload.director_selection + '\nOutcome: ' + payload.outcome + '\n';
    if (payload.outcome == 1) {
      log += 'This drawing was added to the world. Drawing ID: ' + (worlds[payload.world_key].length-1);
    }
    else {
      worlds[payload.world_key].pop();
      log += 'This drawing was not added to the world';
    }
    fs.appendFile('../../server_data/coevolution/' + payload.world_key + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks to begin a new trial
  client.on('request_new_trial', function(payload) {
    var trial = randomizeNewTrial(payload.world_key);
    io.sockets.connected[client.id].emit('start_new_trial', { role:'director', array_items:trial[0], target_picture:trial[2] });
    io.sockets.connected[payload.to].emit('start_new_trial', { role:'matcher', array_items:trial[0], target_picture:trial[2] });
    var log = 'Trial: ' + payload.trial_num + '\nContext IDs: ' + trial[1] + '\nTarget item: ' + trial[2] + '\n';
    fs.appendFile('../../server_data/coevolution/' + payload.world_key + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to terminate the experiment
  client.on('terminate', function(payload) {
    io.sockets.connected[payload.to].emit('terminate');
  });


  // Client disconnects from the server
  client.on('disconnect', function() {
    if (queued_client_ID == client.id) queued_client_ID = null;
  });


});

// ------------------------------------------------------------------
// Listen for messages coming from the clients
// ------------------------------------------------------------------

http.listen(port);
