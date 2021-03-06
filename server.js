// ------------------------------------------------------------------
// Initialize global variables
// ------------------------------------------------------------------

// Port number should match with client.js
var port = 9000;

// Path to a directory where results should be saved
var data_path = '../../server_data/coevolution/';

// A drawing is an array of x- and y-coordinates.
var swirl = [[282,31], [283,29], [284,29], [285,28], [286,27], [287,26], [288,26], [289,25], [291,25], [292,24], [294,24], [295,24], [297,24], [299,24], [301,24], [304,24], [306,24], [308,24], [310,24], [311,24], [313,24], [315,24], [317,24], [319,24], [321,24], [323,24], [325,24], [327,25], [328,26], [331,26], [333,27], [335,28], [336,29], [338,30], [340,31], [343,32], [344,33], [346,34], [348,36], [350,37], [352,38], [355,40], [356,41], [358,42], [360,43], [361,45], [363,46], [365,48], [366,49], [367,51], [369,53], [371,55], [372,57], [374,59], [375,60], [377,63], [377,65], [379,67], [380,69], [381,71], [382,73], [383,75], [384,77], [384,80], [385,82], [386,84], [386,86], [387,89], [387,91], [387,93], [388,95], [388,98], [389,100], [389,103], [389,105], [390,108], [390,111], [391,114], [391,116], [391,119], [391,121], [391,124], [391,127], [391,129], [391,133], [391,136], [391,139], [391,142], [391,145], [390,148], [389,151], [388,154], [387,157], [386,160], [384,163], [383,166], [382,169], [380,171], [379,174], [377,176], [375,179], [374,181], [372,184], [370,187], [369,189], [367,192], [365,195], [363,198], [361,200], [359,202], [356,205], [354,207], [351,209], [349,211], [346,214], [344,216], [342,218], [340,220], [338,222], [336,224], [334,226], [332,228], [330,230], [327,232], [324,234], [322,236], [320,239], [318,241], [315,244], [313,246], [311,249], [309,251], [306,253], [304,255], [302,257], [300,260], [298,263], [297,265], [295,268], [294,271], [292,273], [291,276], [290,278], [289,281], [288,283], [288,285], [287,288], [287,291], [286,293], [286,296], [286,298], [286,301], [286,303], [286,305], [286,307], [286,309], [286,311], [286,313], [286,316], [287,318], [287,321], [288,323], [289,325], [290,327], [291,329], [292,331], [294,333], [295,335], [297,336], [298,338], [300,340], [302,343], [304,345], [307,347], [309,350], [311,352], [314,354], [316,356], [318,358], [320,360], [323,362], [325,364], [328,367], [331,369], [333,372], [336,374], [338,376], [341,379], [343,381], [346,384], [349,386], [352,389], [355,392], [358,395], [361,398], [363,401], [366,403], [368,406], [370,408], [373,411], [375,413], [378,416], [380,419], [382,422], [385,425], [387,428], [389,430], [390,433], [392,436], [393,438], [394,441], [396,444], [396,447], [398,449], [399,452], [399,455], [400,458], [401,460], [401,463], [402,465], [402,468], [403,470], [403,473], [403,475], [403,477], [403,479], [403,481], [402,483], [401,485], [400,487], [398,489], [396,491], [395,493], [394,495], [391,496], [390,498], [388,499], [387,500], [384,502], [382,503], [380,504], [378,505], [376,505], [373,506], [371,507], [369,508], [367,508], [365,509], [362,509], [360,510], [357,510], [354,510], [352,510], [349,510], [347,510], [344,510], [342,510], [340,510], [337,510], [335,510], [332,509], [330,508], [327,508], [324,506], [322,505], [320,504], [318,503], [316,501], [314,499], [312,498], [311,496], [309,495], [308,493], [306,492], [305,490], [303,488], [301,486], [300,484], [299,482], [298,480], [297,477], [296,474], [295,471], [294,468], [293,465], [293,462], [292,459], [292,457], [292,454], [292,450], [292,447], [292,444], [292,441], [292,438], [292,435], [292,432], [294,428], [295,425], [297,421], [299,418], [301,415], [303,411], [304,408], [306,405], [309,401], [311,398], [313,395], [315,391], [316,389], [318,386], [321,382], [323,379], [325,376], [328,374], [330,370], [333,367], [335,364], [338,362], [340,359], [342,357], [344,354], [347,351], [349,348], [352,346], [354,343], [357,340], [359,338], [362,335], [364,332], [367,329], [369,327], [371,323], [374,320], [376,318], [378,315], [380,312], [383,310], [385,307], [387,304], [389,302], [391,299], [393,296], [394,294], [396,291], [398,288], [399,285], [401,283], [402,280], [404,278], [405,275], [406,272], [407,269], [408,267], [409,264], [410,261], [411,258], [411,256], [412,254], [412,251], [413,249], [413,246], [413,243], [414,241], [414,238], [414,236], [414,233], [414,231], [414,229], [414,226], [414,223], [414,221], [414,218], [414,215], [414,213], [414,210], [413,207], [413,204], [412,201], [411,199], [410,196], [409,193], [408,190], [406,187], [405,185], [404,182], [402,180], [400,177], [399,175], [397,172], [395,170], [393,167], [391,165], [389,163], [386,161], [383,159], [381,157], [377,155], [374,153], [372,151], [369,149], [367,148], [364,146], [361,145], [358,143], [355,142], [352,141], [349,139], [346,138], [343,137], [341,136], [338,134], [335,133], [332,132], [328,131], [325,129], [322,128], [318,127], [315,126], [311,125], [308,124], [304,123], [299,122], [296,121], [292,120], [288,119], [284,118], [279,117], [274,116], [270,116], [265,115], [260,114], [254,113], [249,113], [244,112], [239,112], [235,111], [230,111], [225,110], [221,110], [216,110], [212,110], [209,110], [205,110], [202,110], [198,110], [195,110], [192,110], [189,110], [187,110], [184,110], [182,111], [179,111], [177,112], [174,113], [172,114], [169,115], [166,116], [164,117], [162,119], [159,119], [157,121], [155,122], [152,124], [149,125], [147,126], [144,128], [142,130], [140,131], [138,133], [136,135], [134,136], [132,138], [131,140], [129,141], [128,143], [127,144], [126,145], [124,148], [123,149], [121,151], [120,153], [119,155], [117,157], [116,159], [115,161], [114,163], [113,165], [112,168], [111,170], [110,172], [110,175], [109,177], [109,180], [109,183], [109,185], [109,188], [109,191], [109,194], [109,196], [109,199], [109,201], [110,203], [111,206], [113,208], [114,211], [117,213], [119,216], [121,218], [124,221], [126,223], [129,226], [131,229], [134,231], [137,234], [140,237], [143,239], [146,242], [149,245], [152,247], [154,249], [156,251], [158,253], [158,255], [159,257], [160,258], [161,260], [161,261], [161,263], [161,264], [161,265], [161,267], [160,269], [159,269], [158,270], [156,270], [153,271], [151,271], [148,272], [146,272], [143,272], [141,272], [138,272], [136,272], [134,272], [131,272], [129,273], [126,273], [124,274], [122,274], [120,275], [118,276], [116,277], [115,277], [113,279], [112,280], [112,281], [111,283], [110,284], [110,286], [109,287], [109,289], [109,291], [109,292], [109,294], [109,296], [110,298], [111,300], [112,301], [114,303], [116,305], [118,307], [121,309], [123,311], [126,313], [129,316], [131,318], [134,320], [138,322], [141,325], [145,327], [148,330], [152,332], [155,334], [158,337], [160,339], [162,341], [164,343], [165,346], [166,347], [166,349], [167,351], [167,352], [167,353], [167,354], [167,355], [165,355], [163,356], [162,357], [159,357], [157,357], [154,358], [152,358], [149,359], [146,360], [143,361], [141,362], [139,363], [136,364], [134,366], [132,367], [130,369], [129,371], [127,373], [126,375], [125,377], [125,379], [124,381], [124,382], [124,384], [124,386], [124,389], [125,391], [127,393], [129,396], [131,398], [134,401], [136,404], [140,407], [144,410], [148,413], [151,415], [154,419], [157,422], [160,425], [163,428], [165,430], [167,433], [168,435], [169,437], [169,439], [169,440], [169,442], [169,443], [169,444], [167,446], [165,447], [163,448], [160,449], [157,449], [154,450], [152,450], [151,450], [150,450], 'BREAK', [151,80], [150,76], [151,76], [153,77], [156,78], [158,80], [162,82], [165,84], [168,86], [173,89], [177,91], [180,93], [183,95], [186,98], [190,101], [194,104], [197,107], [201,111], [204,114], [207,117], [210,121], [214,124], [216,128], [219,131], [222,135], [224,138], [226,142], [228,145], [230,148], [231,152], [233,155], [234,158], [235,162], [236,165], [238,169], [238,172], [239,175], [240,179], [241,182], [241,186], [241,189], [241,192], [241,194], [241,197], [241,199], [241,202], [241,204], [241,206], [240,209], [238,211], [237,214], [235,216], [233,218], [231,220], [229,221], [226,223], [223,224], [220,225], [218,226], [215,226], [213,227], [210,227], [208,227], [206,227], [204,227], [202,227], [199,227], [198,226], [196,225], [194,224], [192,223], [191,221], [189,218], [187,216], [185,214], [184,212], [182,210], [180,207], [178,204], [177,201], [175,199], [173,196], [173,193], [172,190], [172,187], [172,184], [172,182], [172,179], [172,175], [172,172], [172,169], [172,166], [173,163], [174,159], [175,156], [177,153], [178,150], [180,147], [181,144], [182,141], [184,138], [186,134], [187,131], [189,128], [191,125], [193,122], [195,120], [197,117], [200,114], [202,111], [205,109], [207,106], [210,103], [212,101], [215,99], [219,97], [223,94], [226,92], [230,90], [234,88], [238,87], [243,85], [248,82], [252,81], [255,80], [258,80], [261,79], [263,78], [264,78], [265,78], [266,78]]

// The seed(s) used to initialize each new session
var seeds = [swirl];

// Empty associative array for holding the worlds.
// Takes the form of { session_id : { drawings:[item1, item2, item3, ...], trial_num:1, points:0, time_remaining:1000, temp_drawing: null }, ... }
var worlds = {};

// Hold the ready status of the clients
var clients = {};

// Hold the ID of the queued client until they're paired with another client. Then reset back to 'null'.
// Separate queues for new sessions and restart sessions
var new_session_queue = null;
var restart_session_queue = null;

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
function randomizeNewTrial(session_id) {
  var total_n = worlds[session_id].drawings.length, n_array_items = worlds[session_id].drawings.length, indices = [], array_items = [];
  if (n_array_items > 5) n_array_items = 5;
  while (indices.length < n_array_items) {
    var num = Math.floor(Math.random() * total_n);
    if (indices.indexOf(num) == -1) indices.push(num);
  }
  for (var i=0; i<n_array_items; i++) {
    array_items.push(worlds[session_id].drawings[indices[i]]);
  }
  var random_target = Math.floor(Math.random() * n_array_items);
  return [array_items, indices, random_target];
}

// Generate a random 6-character session ID
function generateSessionID() {
  var text = '', characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i=0; i<6; i++) {
    text += characters.charAt(Math.floor(Math.random() * 62));
  }
  return text;
}

// Parse and load in an old session from the raw data files
function loadPreviousSession(session_id) {
  var last_trial = 0;
  var session_path = data_path + session_id + '/';
  try {
    var files = fs.readdirSync(session_path);
    for (var i=0; i<files.length; i++) {
      if (parseInt(files[i]) > last_trial) last_trial = parseInt(files[i]);
    }
    if (last_trial == 0) return false;
    var world = { drawings:seeds.slice(), trial_num:0, time_remaining:7200, points:0, temp_drawing:null };
    for (var i=1; i<=last_trial; i++) {
      var trial_data = fs.readFileSync(session_path + i, 'utf8').toString('utf8').split('\n');
      world.trial_num = i;
      world.time_remaining = parseInt(trial_data[1].split(': ')[1]);
      world.points = parseInt(trial_data[2].split(': ')[1]);
      if (trial_data.length == 12 && trial_data[10] == 'Drawing added to the world: true') {
        var raw_drawing = trial_data[7].split('; '), drawing = [];
        for (var j=0; j<raw_drawing.length; j++) {
          if (raw_drawing[j] == 'BREAK') drawing.push('BREAK');
          else drawing.push(raw_drawing[j].split(','));
        }
        world.drawings.push(drawing);
      }
    }
    return world;
  }
  catch (e) {
    console.log(e);
    return false;
  }
}

// ------------------------------------------------------------------
// Client event handlers
// ------------------------------------------------------------------

io.sockets.on('connection', function(client) {


  // Client asks to create a new session
  client.on('new_session', function() {
    if (new_session_queue == null) new_session_queue = client.id;
    else {
      var partner_id = new_session_queue;
      new_session_queue = null;
      var session_id = generateSessionID();
      worlds[session_id] = { drawings:seeds.slice(), trial_num:null, time_remaining:null, points:null, temp_drawing:null };
      clients[client.id] = false;
      clients[partner_id] = false;
      io.sockets.connected[partner_id].emit('initialize_new', { partner_id:client.id, session_id:session_id });
      io.sockets.connected[client.id].emit('initialize_new', { partner_id:partner_id, session_id:session_id });
      fs.mkdir(data_path + session_id, errorCallback);
    }
  });


  // Client makes a request for a previous session
  client.on('request_session', function(payload) {
    if (payload.session_id in worlds == false) {
      previous_session = loadPreviousSession(payload.session_id);
      if (previous_session == false) {
        io.sockets.connected[client.id].emit('request_error');
        return false;
      }
      worlds[payload.session_id] = previous_session;
    }
    restart_session_queue = { session_id:payload.session_id, client_id:client.id };
    io.sockets.connected[client.id].emit('request_accepted');
  });


  // Client asks to restart a previous session
  client.on('restart_session', function() {
    if (restart_session_queue == null) {
      io.sockets.connected[client.id].emit('request_session_id');
    }
    else {
      var queued_session_id = restart_session_queue.session_id;
      var queued_client_id = restart_session_queue.client_id;
      restart_session_queue = null;
      clients[client.id] = false;
      clients[queued_client_id] = false;
      io.sockets.connected[queued_client_id].emit('initialize_restart', { partner_id:client.id, session_id:queued_session_id, trial_num:worlds[queued_session_id].trial_num, time_remaining:worlds[queued_session_id].time_remaining, points:worlds[queued_session_id].points });
      io.sockets.connected[client.id].emit('initialize_restart', { partner_id:queued_client_id, session_id:queued_session_id, trial_num:worlds[queued_session_id].trial_num, time_remaining:worlds[queued_session_id].time_remaining, points:worlds[queued_session_id].points });
    }
  });


  // Client indicates that they are ready to begin
  client.on('ready', function(payload) {
    clients[client.id] = true;
    if (clients[payload.partner_id] == true) {
      var trial = randomizeNewTrial(payload.session_id);
      io.sockets.connected[client.id].emit('start_experiment', { role:'director', array_items:trial[0], target_picture:trial[2] });
      io.sockets.connected[payload.partner_id].emit('start_experiment', { role:'matcher', array_items:trial[0], target_picture:trial[2] });
      var log = 'Trial: ' + payload.trial_num + '\nTime remaining: ' + payload.time_remaining + '\nTotal points: ' + payload.points + '\nContext IDs: ' + trial[1] + '\nTarget item: ' + trial[2] + ' (' + trial[1][trial[2]] + ')\n';
      fs.writeFile(data_path + payload.session_id + '/' + payload.trial_num, log, errorCallback);
    }
  });


  // Client asks you to pass a signal to another client
  client.on('send_signal', function(payload) {
    io.sockets.connected[payload.to].emit('receive_signal', payload);
    var log = 'Signal: ' + payload.signal + '\n';
    fs.appendFile(data_path + payload.session_id + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to pass a drawing to another client
  client.on('send_drawing', function(payload) {
    io.sockets.connected[payload.to].emit('receive_drawing', payload);
    worlds[payload.session_id].temp_drawing = payload.drawing;
    var log = 'Matcher selection: ' + payload.matcher_selection + '\nDrawing: ' + payload.drawing.join('; ') + '\n';
    fs.appendFile(data_path + payload.session_id + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to pass feedback to another client
  client.on('send_feedback', function(payload) {
    io.sockets.connected[payload.to].emit('receive_feedback', payload);
    var log = 'Director selection: ' + payload.director_selection + '\nOutcome: ' + payload.outcome + '\n';
    if (payload.outcome == 1) {
      worlds[payload.session_id].drawings.push(worlds[payload.session_id].temp_drawing);
      worlds[payload.session_id].temp_drawing = null;
      log += 'Drawing added to the world: true\nDrawing ID: ' + (worlds[payload.session_id].drawings.length-1);
    }
    else {
      worlds[payload.session_id].temp_drawing = null;
      log += 'Drawing added to the world: false\nDrawing ID: null';
    }
    fs.appendFile(data_path + payload.session_id + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks to begin a new trial
  client.on('request_new_trial', function(payload) {
    var trial = randomizeNewTrial(payload.session_id);
    worlds[payload.session_id].trial_num = payload.trial_num;
    worlds[payload.session_id].time_remaining = payload.time_remaining;
    worlds[payload.session_id].points = payload.points;
    io.sockets.connected[client.id].emit('start_new_trial', { role:'director', array_items:trial[0], target_picture:trial[2] });
    io.sockets.connected[payload.to].emit('start_new_trial', { role:'matcher', array_items:trial[0], target_picture:trial[2] });
    var log = 'Trial: ' + payload.trial_num + '\nTime remaining: ' + payload.time_remaining + '\nTotal points: ' + payload.points + '\nContext IDs: ' + trial[1] + '\nTarget item: ' + trial[2] + ' (' + trial[1][trial[2]] + ')\n';
    fs.writeFile(data_path + payload.session_id + '/' + payload.trial_num, log, errorCallback);
  });


  // Client asks you to terminate the experiment
  client.on('terminate', function(payload) {
    io.sockets.connected[payload.to].emit('terminate');
    if (payload.session_id in worlds == true) delete worlds[payload.session_id];
  });


  // Client disconnects from the server
  client.on('disconnect', function() {
    if (new_session_queue != null && new_session_queue == client.id) new_session_queue = null;
    if (restart_session_queue != null && restart_session_queue[1] == client.id) restart_session_queue = null;
  });


});

// ------------------------------------------------------------------
// Listen for messages coming from the clients
// ------------------------------------------------------------------

http.listen(port);
