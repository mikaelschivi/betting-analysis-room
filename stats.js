class Stats { 
    constructor(){
        this.pullHistory = []
        this.pullHistoryLength = 0
        
        this.guess = 0
        this.win = 0
        this.weight = 0

        this.Colors = {
            0: 'White',
            1: 'Red',
            2: 'Black'
        };

        // each pull takes 30s so for 2hr 
        // = 60 * 60 * 2 / 30 = 240 pulls 
        this.timeScope = 240

        this.isMartingale = 0
    };
    
    PopulatePullHistory(rollColor, rollNumber, rollId, rollTime) {
        const data = {
            id: rollId,
            roll: rollNumber,
            color: this.Colors[rollColor],
            time: rollTime
        }
        this.pullHistory.push(data)
        this.pullHistoryLength += 1
    };

    GenerateRandomGuess() {
        if (this.isMartingale) {
            return null
        }
        const number = Math.floor(Math.random() * 30)
        let generatedGuess = 0
        if (number >= 1 && number <= 15) {
            generatedGuess = 1
        }
        else if (number >= 16 && number <= 30) {
            generatedGuess = 2
        }
        else {
            // TODO: redo generation method to get 0s more unlikely
            //       the chance for this recursion hit 0 again is 1/29 * 1/29 = 0.11%
            generatedGuess = this.GenerateRandomGuess()
        }
        this.guess = generatedGuess
        return generatedGuess
    };

    PastPullsWeight(color) {
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

    CheckResult(result){
        if(this.isMartingale){
            console.log('GALEGALEGALEGALE')
            if(result == this.guess){
                this.win += 1
                this.isMartingale = 0
            }
        }
        if(result === this.guess){
            this.win += 1
        }
    }

    CalculateWinRatio() {
        return this.win / this.pullHistoryLength;
    };

    ShowSessionStats(rollColor, rollNumber, rollId, guess, currentHour) {
        console.log(`color: \x1b[32m${this.Colors[rollColor]}\x1b[0m roll: \x1b[32m${rollNumber}\x1b[0m id: \x1b[32m${rollId}\x1b[0m - ${currentHour}`);
        if (guess === rollColor){
            console.log("result: WIN")
        } else {
            console.log("result: LOSS")
        }
        console.log('table weight:', this.PastPullsWeight(rollColor));
        console.log('win ratio:', this.CalculateWinRatio());
    }
}

module.exports = Stats