const WebSocket = require('ws');
const mathLib = require('./math');

// blaze websocket endpoint
const socket = new WebSocket("wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket");

// websocket on ping
const pingInterval = setInterval(function() {
    socket.send('2');
    console.log('+ ping');
  }, 25000);

// websocket on open
socket.onopen = function(event) {
    console.log("+ connection opened");
    // subscrition request to enter double_v2 chat/game
    socket.send('421["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]');
    console.log("+ sent subscription request to room double_v2")
};


// I REALLY NEED TO DO SOME REFACTORING... I KNOW
let rollId = 0;
let checkStatus = 0;
let guess = -1;
let hasGuessed = 'NO';
socket.onmessage = function(event) {
    // grab time for pulls
    let time = new Date();
    let currentHour = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();

    // this if catches the pong messages provided by the server once with ping it.
    if (event.data === '3') {
        console.log('- pong');
    }
    else {
        // try-catch to parse data
        try {
            // parses the data into a JSON format after the websocket 42 indentifier.
            // i delete "bets" cus its a fuckin big ass blob of whatever information.
            const parsedData = JSON.parse(event.data.substr(2));
            delete parsedData[1].payload.bets;
            const stringfiedData = JSON.stringify(parsedData);

            // this throws away the live.bet.feed id and cleans output
            if (parsedData[1].id === 'double.tick' && checkStatus != parsedData[1].payload.status){
                checkStatus = parsedData[1].payload.status;
                console.log(`status: \x1b[34m${checkStatus}\x1b[0m`);

                if (checkStatus === 'waiting' && hasGuessed === 'NO') {
                    rollId = parsedData[1].payload.status;
                    guess = mathLib.generateRandomNumber();
                    console.log('   guess:', guess);
                    hasGuessed = 'YES';
                }
            }

            // this will be true once per roll and its easier to use data
            if ( (rollId != parsedData[1].payload.id) && (parsedData[1].payload.status === 'complete') ){
                rollId = parsedData[1].payload.id;
                let dataSampleVar = mathLib.cardPull(parsedData[1].payload.color);

                console.log(`color: \x1b[32m${parsedData[1].payload.color}\x1b[0m roll: \x1b[32m${parsedData[1].payload.roll}\x1b[0m id: \x1b[32m${parsedData[1].payload.id}\x1b[0m - ${currentHour}`);
                console.log('dataSample size:', dataSampleVar.length);
                console.log('table weight:', mathLib.tableWeight(parsedData[1].payload.color));
                hasGuessed = 'NO';
            }
        // treat websocket handshake messages || catch errors
        } catch (error) {
            if ( event.data.startsWith('4')|| event.data.startsWith('0') ){
                console.log(event.data);
            }
            else{
                console.log(error);
            }
        }
    }
};

// websocket on error
socket.onerror = function(error) {
    console.log("!! error:", error);
};

// websocket on close
socket.onclose = function(event) {
    console.log("- connection close");
};
