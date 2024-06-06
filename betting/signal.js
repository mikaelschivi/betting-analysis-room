class Signal{
    constructor(){
        // https://en.wikipedia.org/wiki/Multimodal_distribution
        // 
        // The meaning os this class is simple:
        // In order to appear more legit the "signals" for betting a specific
        // color. My intent here is to generate a Bimodal Distribution,
        // utilizing the "peaks" as a way to have the bot send more "signals"
        // around a time setted by the user.

        this.tinyDistribution = this.GenerateBimodalDistribution(16)
        // this.largeDistribution = this.GenerateBimodalDistribution(50)
        this.ShowGeneratedTimeEvents()
    }
    GenerateBimodalDistribution(signalAmount) {
        const sampleSize = signalAmount / 2
        const sigma = 150

        const peakA = 720, 
              peakB = 1170;
        
        let A = this.GaussianMethod(sampleSize, peakA, sigma)
        let B = this.GaussianMethod(sampleSize, peakB, sigma)
        
        const distribution = A.concat(B)
        distribution.sort((a, b) => a - b);

        return distribution
    }
    GaussianMethod(sampleSize, mean, sigma) {
        let values = []
        
        for( let i = 0; i < sampleSize; i++){
            let u = 0, v = 0;
            while( u === 0 || v === 0){
                u = Math.random();
                v = Math.random();
            }
            let z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)    
            let randomValue = (Math.floor(mean + z * sigma)) % 1440
            
            if(!values.includes(randomValue)) {
                values.push(randomValue)
            }
        }
        return values
    }
    ShowGeneratedTimeEvents(){
        const distribution = this.tinyDistribution;

        for( let i = 0; i < distribution.length; i++) {
            let item = distribution[i]
            console.log([item, `${(item-item%60)/60}h${item%60}`])
        }

    }
}