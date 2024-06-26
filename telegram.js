const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

// get chatid by api at:
// https://api.telegram.org/bot<token>/getUpdates
const TOKEN = process.env.TOKEN
const CHATID = process.env.CHATID
const bot = new TelegramBot(TOKEN, { polling: false });

const isProduction = process.env.PRODUCTION ? true : false

function botMessage(text) {
    console.log(`bot message: ${text}`)
    if (!isProduction){
        console.log('[dev enviroment no messages send]')
        return;
    }
    bot.sendMessage(CHATID, text);
};

exports.sendCustomMessage = function(text) {
    botMessage(text);
};

exports.sendSignal = function(guess) {
    let message = (guess === 1) ? `📢 JOGUE NO 🔴` : `📢 JOGUE NO ⚫️`;
    botMessage(message);
};

exports.checkSignal = function(result) {
    let message = (result) ? `✅ Win` : `❌ Loss`;
    botMessage(message);
};