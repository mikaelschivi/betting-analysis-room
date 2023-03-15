const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// grab token + chatid in file - could get chatid by api/getUpdates but easier this way
const TOKEN = fs.readFileSync('./helper/token', 'utf8').trim();
const CHATID = fs.readFileSync('./helper/chat_id', 'utf8').trim();

// bot handler
const bot = new TelegramBot(TOKEN, { polling: false });

// send message to telegram channel
exports.sendSignal = function( guess ) {
    let message = '';
    if (guess === 1) {
        message = `📢 JOGUE NO 🔴`;
        bot.sendMessage(CHATID, message);
    }
    else if (guess === 2) {
        message = `📢 JOGUE NO ⚫️`;
        bot.sendMessage(CHATID, message);
    }
    return message;
};

// check signal i will eventually use this for martingale
exports.checkSignal = function( guess, roll ) {
    let message = '';
    if (guess === roll) {
        message = `✅ Win`;
        bot.sendMessage(CHATID, message);
    }
    else {
        message = `❌ Loss`;
        bot.sendMessage(CHATID, message);
    }
    return message
};