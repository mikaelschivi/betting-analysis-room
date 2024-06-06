class Martingale{
    constructor() {
        this.pastGaleResults = [];
        this.galeMaxAmount = 4;
        
        this.currentGaleSession = -1;
        this.isGale = false;
    }
    InitializeGaleStrategy() {
        if (this.isGale) {
            return;
        }
        this.isGale = true;
        this.currentGaleSession += 1;
    }
    UpdateGale(result){
        if (!this.isGale){
            return
        }
        
        if (result) {
            this.ResetStrategy(1)
            return
        }       
        if(this.currentGaleSession >= this.galeMaxAmount) {
            // if loss max on gale
            this.ResetStrategy(0)
            return 
        }
        
        this.currentGaleSession += 1
    }
    ResetStrategy(result) {
        this.pastGaleResults.push(result);
        this.currentGaleSession = -1;
        this.isGale = false;
        this.PrintPastGaleResults();
    }
    PrintPastGaleResults(){
        let count = 0
        for( let i = 0; i < this.pastGaleResults; i++) {
            if (this.pastGaleResults[i] === 1){
                count+=1
            }
        }
        console.log(`Martingale info:`)
        console.log(this.pastGaleResults)
        console.log(`strategy win ratio: ${count / this.pastGaleResults.length * 100}%`)
    }
}

module.exports = Martingale;