class SpaceMonkey{
    crashUpperLimit = 1024;
    crashLowerLimit = 1;
    crashDecimalPoint = 2;

    constructor(){
        this.factor = 0;
        this.multiplier = 0;
        // this value of crash is an average of 100M generated random numbers from 1 to 2^10
        this.crash = 8.10; 
    }

    setCrashFactor(){
        //defs: factor : factor is a float number with 2 decimal, it takes value between 1 - 1023 (lower limit to upper limit -1)

        this.factor = parseFloat(getRandomFloat(this.crashLowerLimit,this.crashUpperLimit-1,this.crashDecimalPoint))
        
        function getRandomFloat(min, max, decimals) {
            return parseFloat(Math.random() * (max - min) + min).toFixed(decimals);
        }
    }

    setMultiplier(){
        //multiplier: calculation of crash point with %98 RTP 

        this.multiplier = 0.98*this.crashUpperLimit/(this.crashUpperLimit-this.factor);
    }

    // setPredefinedCrash(){
    //     if(this.multiplier % 87 === 0 ){
    //         return 1;
    //     }
    // }
    

}


module.exports = SpaceMonkey