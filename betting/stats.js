const Martingale = require('./martingale')

class Stats extends Martingale{ 
    constructor(){
        super()
        this.pullHistory = []
        this.pullHistoryLength = 0
        
        this.guess = 0
        this.win = 0
        this.weight = 0
        this.playedGames = 0

        this.Colors = {
            0: 'White',
            1: 'Red',
            2: 'Black'
        };

        // each pull takes 30s so for 2hr 
        // = 60 * 60 * 2 / 30 = 240 pulls 
        this.timeScope = 240
    };
    
    PopulatePullHistory(rollColor, rollNumber, rollId, rollTime) {
        const data = {
            id: rollId,
            roll: rollNumber,
            color: this.Colors[rollColor],
            time: rollTime
        }
        this.pullHistory.push(data);
        this.pullHistoryLength += 1;
    };

    GenerateRandomGuess() {
        if (this.isGale) {
            return this.guess;
        }
        const number = Math.floor(Math.random() * 30)
        let generatedGuess = 0;
        
        if (number >= 1 && number <= 15) {
            generatedGuess = 1;
        }
        else if (number >= 16 && number <= 30) {
            generatedGuess = 2;
        }
        else {
            // TODO: redo generation method to get 0s more unlikely
            //       the chance for this recursion hit 0 again is 1/30 * 1/30 = 0.11%
            generatedGuess = this.GenerateRandomGuess();
        }
        this.guess = generatedGuess;
        this.playedGames += 1;

        return generatedGuess;
    };

    UpdateTableWeight(color) {
        if (color === 0) {
            this.weight = 0
        }
        if (color === 1) {
            this.weight+=1
        }
        if (color === 2) {
            this.weight-=1
        }

        return this.weight
    };

    CalculateWinRatio() {
        return ( this.win / this.playedGames );
    };

    ResultHandler(result, rollColor) {        
        this.UpdateTableWeight(rollColor);

        if (result) {
            if(this.isGale){
                this.UpdateGale(1);
            }
            this.win += 1
            this.PrintStats()

        } else {
            if(!this.isGale){
                this.InitializeGaleStrategy()
                console.log("Initializing strategy.")
            }
            console.log(`GALE: ${this.currentGaleSession+1}`)
            this.UpdateGale(0)
        }

    }
    
    PrintStats(){
        console.log('table weight:', this.weight);
        console.log('overall win ratio:', this.CalculateWinRatio());
    }
}

module.exports = Stats