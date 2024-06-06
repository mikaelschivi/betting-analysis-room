const WebSocket = require('ws');
const Statistics = require('./betting/stats');
const telegramBot = require('./telegram');

const socket = new WebSocket(process.env.API_ENDPOINT);

const Stats = new Statistics();
const time = new Date();

function FilterWebSocketEvent(event) {
    try{
        // handle websocket protocol stuff
        if (event.data.startsWith(0) || event.data === "40" ||
            event.data == '431["ok"]' || event.data === "3") {
            return null
        }
        
        const parsedFilteredData = JSON.parse(event.data.substr(2))
        return parsedFilteredData

    } catch (e) {
        console.log(e)
        console.log(event.data.substr(2))
        console.log("Error in filtering data")
    }
}

const pingInterval = setInterval(function() {
    socket.send('2');
}, 25000);

socket.onopen = function(event) {
    console.log(`+ connection opened ${time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`);
    console.log("+ sent subscription request to room double_v2")
    try{
        socket.send('421["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]');
    } catch(e) {
        console.log(`Error in establishing connection: ${e}`)
    }
    console.log('+ success')
}

let rollId = 0;
let guess;
let status = '';
socket.onmessage = function(event) {
    try {
        let currentHour = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        let data = FilterWebSocketEvent(event);
        if (!data || data[1].id != 'double.tick') {
            return
        }
        let payload = data[1].payload;
        delete payload.bets;

        if (status != payload.status){
            status = payload.status
            console.log(`\n${status}\n`)
        }

        if (rollId != payload.id && payload.status === 'waiting') {
            rollId = payload.id;
            console.log('--- new roll ---');
            console.log('Roll number:', Stats.pullHistoryLength+1);
            guess = Stats.GenerateRandomGuess();
            console.log(`guess: ${Stats.Colors[guess]}`);
            console.log(telegramBot.sendSignal(guess));
        }
            
        if (rollId == payload.id && (payload.status === 'complete' || payload.status === 'rolling')) {
            Stats.PopulatePullHistory(payload.color, payload.roll, payload.id, currentHour);
            console.log('--- result ---');
            Stats.ResultHandler(payload.color, payload.roll, payload.id, guess, currentHour)
            rollId = 0;
        }

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log(`\nParsing error: ${error} =>  data: ${error.data}\n`)
        } else {
            console.log(`Error: ${error}`)
        }
    }
};

socket.onerror = function(error) {
    console.log("Socket connection error:", error);
};

socket.onclose = function(event) {
    console.log("- connection close");
};
