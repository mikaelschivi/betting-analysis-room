// dataSample as we go
// 120 is 1hr scope
let dataSample = [];
exports.cardPull = function(color){
    dataSample.push(color);
    if (dataSample.length > 120){
        dataSample.shift();
    }
    return dataSample;
}

// calculte variance - this should be around 0.37-0.38 on bigger samples
exports.calculateVariance = function(dataSample) {
    // calculate mean
    // calculate the sum of the squared differences between each data point and the mean
    // calculate the variance
    const mean = dataSample.reduce((a, b) => a + b, 0) / dataSample.length;
    const sumOfSquaredDiffs = dataSample.reduce((a, b) => a + Math.pow((b - mean), 2), 0);
    const variance = sumOfSquaredDiffs / dataSample.length;
  
    return variance;
}

exports.generateRandomNumber = function(){
    // turns out that just doing it randomly gets you a 5-10% better result
    // who would know
    randomNumber = Math.floor(Math.random() * 16)
    if(1 <= randomNumber <= 7){
        return 1;
    }
    else if( 7 < randomNumber <= 14){
        return 2;
    }
}

// calculate win ratio
// it would be better to put in a list with 1 for win and 0 for loss
// calculate all the 1s / size
// then shift when size > datasample lenght
// should fix this asap
let win = 0;
let games = 0;
exports.guessedRight = function(guess, result){
    if (guess===result){
        win+=1;
    }
    games+=1;

    return (100*(win/games)).toFixed(2);
}

// this is just kinda calculate some kinda of frequency for 0 rolls.
let weight = 0; 
exports.tableWeight = function(color){
    if (color===0){
        weight = 0;
    }
    if (color===1){
        weight+=1;
    }
    if (color===2){
        weight-=1;
    }

    return weight
}