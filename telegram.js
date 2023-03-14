const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// grab token + chatid in file
const TOKEN = fs.readFileSync('./helper/token', 'utf8').trim();
const CHATID = fs.readFileSync('./helper/chat_id', 'utf8').trim();

// create bot
const bot = new TelegramBot(TOKEN, { polling: false });

// function to send message to telegram channel
exports.sendSignal = function( guess ) {
    if (guess === 1) {
        const message = `📢 JOGUE NO 🔴`;
        bot.sendMessage(CHATID, message);
        console.log('signal:',message);
    }
    if (guess === 2) {
        const message = `📢 JOGUE NO ⚫️`;
        bot.sendMessage(CHATID, message);
        console.log('signal:',message);
    }
};

// check signal i will eventually use this for martingale
exports.checkSignal = function( guess, roll) {
    if (guess === roll) {
        const message = `✅ Win`;
        bot.sendMessage(CHATID, message);
        console.log('signal check:',message);
    }
};