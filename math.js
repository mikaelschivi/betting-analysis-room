// dataSample as we go
// 120 is 1hr scope
let dataSample = [];
exports.cardPull = function(color) {
    dataSample.push(color);
    if (dataSample.length > 120) {
        dataSample.shift();
    }
    return dataSample;
};

// turns out that just doing it randomly gets you a 5-10% better result who would know
exports.generateRandomNumber = function() {
    number = Math.floor(Math.random() * 15)
    if (1 <= number <= 7) {
        return 1;
    }
    else if (8 <= number <= 15) {
        return 2;
    }
    else {
        // do nothing
    }
};

// kinda calculate some kinda of frequency for 0 rolls.
let weight = 0; 
exports.tableWeight = function(color) {
    if (color === 0) {
        weight = 0;
    }
    if (color === 1) {
        weight+=1;
    }
    if (color === 2) {
        weight-=1;
    }

    return weight;
};

let win = 0;
let games = 0;
exports.winRatio = function(guess, roll) {
    if (guess === roll) {
        win+=1;
    }
    games+=1;

    return win/games;
};