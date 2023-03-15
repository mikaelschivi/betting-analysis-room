const WebSocket = require('ws');
const mathLib = require('./math');
const telegramBot = require('./telegram');

// blaze websocket endpoint
const socket = new WebSocket("wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket");

// websocket on ping
const pingInterval = setInterval(function() {
    socket.send('2');
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
    // toLocaleTimeString will print exact formated date i.e. 01:43:07 AM
    let currentHour = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});

    // try-catch to parse data
    try {
        // parses the data into a JSON format after the websocket 42 indentifier.
        const parsedData = JSON.parse(event.data.substr(2));
        // i delete "bets" cus its a fuckin big ass blob of whatever information.
        delete parsedData[1].payload.bets;
        const stringfiedData = JSON.stringify(parsedData);

        // throws away the live.bet.feed id and cleans output
        if (parsedData[1].id === 'double.tick' && checkStatus != parsedData[1].payload.status) {
            checkStatus = parsedData[1].payload.status;
            console.log(`status: \x1b[34m${checkStatus}\x1b[0m`);

            // throw guess
            if (checkStatus === 'waiting' && hasGuessed === 'NO') {
                rollId = parsedData[1].payload.status;
                guess = mathLib.generateRandomNumber();

                console.log('--- new roll ---');
                console.log(telegramBot.sendSignal(guess));
                console.log('guess:', guess);

                hasGuessed = 'YES';
            }
        }

        // will be true once per roll and its easier to use data
        if ( (rollId != parsedData[1].payload.id) && (parsedData[1].payload.status === 'complete') ) {
            rollId = parsedData[1].payload.id;
            let dataSampleVar = mathLib.cardPull(parsedData[1].payload.color);

            console.log('--- roll result ---');
            console.log(telegramBot.checkSignal(guess, parsedData[1].payload.color));
            console.log(`color: \x1b[32m${parsedData[1].payload.color}\x1b[0m roll: \x1b[32m${parsedData[1].payload.roll}\x1b[0m id: \x1b[32m${parsedData[1].payload.id}\x1b[0m - ${currentHour}`);
            console.log('dataSample size:', dataSampleVar.length);
            console.log('table weight:', mathLib.tableWeight(parsedData[1].payload.color));
            console.log('win ratio:', mathLib.winRatio(guess, parsedData[1].payload.color));
            hasGuessed = 'NO';
        }
    
    // treat websocket handshake and pong messages || catch errors 
    } catch (error) {
        // websocket handshake
        if ( event.data.startsWith('4') || event.data.startsWith('0') ) {
            console.log(event.data);
        }
        // pong messages
        else if (event.data.startsWith('3')){
            // do nothing
        }
        // errors should be none
        else {
            console.error('!! catch error:', error);
            console.log(event.data);
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
