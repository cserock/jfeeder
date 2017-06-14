const CMD_INIT = 1000;
const CMD_SET = 1001;
const CMD_GET = 1002;

const ERR_CD_SUCCESS = 0;
const ERR_CD_INVALIDATED_PARAM = 1;
const ERR_CD_DEFAULT = 10;

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
  port: 8081
});

var firebase = require("firebase");

var config = require('./config');

var uid = "";
var name = "";
var email = "";

var initData = {
  'onMeal': 0
};
var returnData = {
  'err_cd': 0,
  'data': []
};

// Initialize the default app
firebase.initializeApp(config);

function setReturnData(errorCode, data) {
  return {
    'err_cd': errorCode,
    'data': data
  };
}

function cmdInit(jsonData, ws) {
  console.log("cmdInit");
  console.log("jsonData : " + JSON.stringify(jsonData));
  console.log("sid : " + jsonData.sid);

  firebase.database().ref(jsonData.sid).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      console.log("exist sid");
    } else {
      console.log("no exist sid");

      firebase.database().ref(jsonData.sid).set(initData);

      /*
      firebase.database().ref(jsonData.sid).set({
         'onMeal': 0
      });
      */
    }

  });
}

function cmdGet(sid, data, ws) {
  console.log("cmdGet");
  console.log("sid : " + sid);
  console.log("data : " + JSON.stringify(data));

  var ledRef = firebase.database().ref(sid);
  ledRef.on('value', function(snapshot) {

    if (snapshot.val()) {
      console.log("onMeal : " + snapshot.val().onMeal);
      var data = {
        'onMeal': snapshot.val().onMeal
      };
      ws.send(JSON.stringify(setReturnData(ERR_CD_SUCCESS, data)));
    }

  });
}

function cmdSet(sid, data, ws) {
  console.log("cmdSet");
  console.log("sid : " + sid);
  console.log("data : " + JSON.stringify(data));

  // firebase.database().ref(sid).set(data);
  firebase.database().ref(sid).update(data);
}

wss.on('connection', function(ws) {
  ws.send('connected...');

  ws.on('message', function(message) {
    console.log('received: %s', message);
    try {
      var jsonObj = JSON.parse(message);
      var sid = jsonObj.sid;
      var data = jsonObj.data[0];

      switch (jsonObj.cmd) {
        case CMD_INIT:
          cmdInit(sid, data, ws);
          break;
        case CMD_GET:
          cmdGet(sid, data, ws);
          break;
        case CMD_SET:
          cmdSet(sid, data, ws);
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
      ws.send(JSON.stringify(setReturnData(ERR_CD_INVALIDATED_PARAM, null)));
    }

  });

});
