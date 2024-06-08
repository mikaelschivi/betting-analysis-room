const WebSocket = require('ws');
const Statistics = require('./betting/stats');
const telegramBot = require('./telegram');

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


let timeoutInterval = 5000;

function Initialize() {
    let socket = new WebSocket(process.env.API_ENDPOINT);
    
    const pingInterval = setInterval(function() {
        socket.send('2');
    }, 25000);
    
    let rollId = 0;
    let guess;
    let status = '';

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
                console.log(`${status}`)
            }

            if (rollId != payload.id && payload.status === 'waiting') {
                rollId = payload.id;
                console.log('--- new roll ---');
                console.log('Roll number:', Stats.pullHistoryLength+1);
                guess = Stats.GenerateRandomGuess();
                console.log(`guess: ${Stats.Colors[guess]}`);
                if(!Stats.isGale) {
                    telegramBot.sendSignal(guess);
                };
                console.log('----------------');
            }
                
            if (rollId == payload.id && (payload.status === 'complete' || payload.status === 'rolling')) {
                console.log(`color: \x1b[32m${Stats.Colors[payload.color]}\x1b[0m roll: \x1b[32m${payload.roll}\x1b[0m id: \x1b[32m${payload.id}\x1b[0m - ${currentHour}`);

                Stats.PopulatePullHistory(payload.color, payload.roll, payload.id, currentHour);
                let result = (guess === payload.color);
                console.log('--- result ---');
                console.log(`result: ${result ? "WIN" : "LOSS"}`)
                let gale = Stats.isGale;
                if(result) {
                    if(gale){
                        let message = `✅ Win no Gale: ${Stats.currentGaleSession+1}`
                        telegramBot.sendCustomMessage(message)
                    } else {
                        telegramBot.checkSignal(result);
                    }
                } else if (!result) {
                    if(Stats.currentGaleSession >= Stats.galeMaxAmount) {
                        telegramBot.checkSignal(result);
                    }
                }
                Stats.ResultHandler(result, payload.color)
                console.log('--------------');
                
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
        console.log(`- connection error: ${error}`);
    };

    socket.onclose = function(event) {
        console.log(event.code, event.reason);
        console.log("- connection close");
        console.log("- attempting to reconnect")
        timeoutInterval = Math.min(timeoutInterval * 2, 60000); // Exponential backoff (max 60 seconds)
        console.log(`- reconnecting in ${timeoutInterval / 1000}secs...`);
        setTimeout(Initialize, timeoutInterval)

    };
}

// Application entry point  
Initialize();