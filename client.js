var WebSocket = require('ws')
// var ws = new WebSocket('ws://mamma.neosave.me:8081');
var ws = new WebSocket('ws://localhost:8081');

var sid = "4OI5fC0CzgQc2P8GdoQ2OJVnHBz2";

const CMD_INIT = 1000;
const CMD_SET = 1001;
const CMD_GET = 1002;

const ERR_CD_SUCCESS = 0;
const ERR_CD_INVALIDATED_PARAM = 1;
const ERR_CD_DEFAULT = 10;

ws.on('open', function() {
    // ws.send('something');
    // init
    /*
    setTimeout(function() {
      // var message = {'onLed':1, 'onMeal':1, 'uid':uid};
      var message = {'cmd':CMD_INIT, 'data':[{'sid': sid}]};
       ws.send(JSON.stringify(message));
    }, 2000);
    */
    // set
    /*
    setTimeout(function() {
      // var message = {'onLed':1, 'onMeal':1, 'uid':uid};
      var message = {'cmd':CMD_SET, 'sid':sid, 'data':[{'onMeal':1}]};
       ws.send(JSON.stringify(message));
    }, 2000);
*/
    // get
    setTimeout(function() {
      var message = {'cmd':CMD_GET, 'sid':sid, 'data':[]};
       ws.send(JSON.stringify(message));

       setTimeout(function() {
         // var message = {'onLed':1, 'onMeal':1, 'uid':uid};
         var message = {'cmd':CMD_SET, 'sid':sid, 'data':[{'onMeal':40}]};
          ws.send(JSON.stringify(message));
       }, 2000);

    }, 2000);

    // update
    /*
    setTimeout(function() {
      var uid = "4OI5fC0CzgQc2P8GdoQ2OJVnHBz1";
      // var message = {'onLed':1, 'onMeal':1, 'uid':uid};
      var message = {'onLed':0, 'onMeal':0, 'uid':uid};
       ws.send(JSON.stringify(message));
    }, 2000);
    */

});
ws.on('message', function(message) {
    console.log('received: %s', message);
});
