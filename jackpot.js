const _ = require("lodash")

class JackpotController {
 
    initialPrize = {
        "JP1": 10, 
        "JP2": 50, 
        "JP3": 250, 
        "JP4": 3000,
        "JP5": 100000
    }

    //counter = {"JP1": 0,"JP2": 0,"JP3": 0,"JP4": 0,"JP5": 0};
    
    constructor(){  
        this.currentPrize = { 
            "JP1": this.initialPrize["JP1"], 
            "JP2": this.initialPrize["JP2"], 
            "JP3": this.initialPrize["JP3"], 
            "JP4": this.initialPrize["JP4"],
            "JP5": this.initialPrize["JP5"]
        }   
        
        this.prize = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        this.roundCounter = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        this.counterForAllRounds = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        this.increaseAmount = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        this.winAmount = 0;
        this.totalWinAmount = 0;    
            
    }

    updateJackpot(newJackpots,betAmount){
        this.increaseJPCounts(newJackpots);
        this.checkJackpotWin();
        this.setProgressiveIncrement(betAmount);
        this.evaluateCurrentJackpotValues();
        this.evaluateTotalJackpotWin();
    }

    increaseJPCounts(newJackpots){
        this.clearRound()
        let count = newJackpots;
        this.roundCounter = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        switch (true){
            case (count === 1):
                this.roundCounter["JP1"] = 1;
                this.counterForAllRounds["JP1"] += 1;
                break;
            case (count === 2):
                this.roundCounter["JP2"] = 1;
                this.counterForAllRounds["JP2"] += 1;    
                break;
            
            case (count === 3):
                this.roundCounter["JP3"] = 1;
                this.counterForAllRounds["JP3"] += 1;
                break;

            case (count === 4):
                this.roundCounter["JP4"] = 1;
                this.counterForAllRounds["JP4"] += 1;
                break;

            case (count === 5):
                this.roundCounter["JP5"] = 1;
                this.counterForAllRounds["JP5"] += 1;
                break;
        }
    }
  
    checkJackpotWin(){
        
        for(let i = 1 ; i<6; i++){
            if (this.roundCounter["JP" + (i).toString()] === 1){
                this.prize["JP" + (i).toString()] = this.currentPrize["JP" + (i).toString()] 
                this.winAmount += this.prize["JP" + (i).toString()]
            }
        }
    }

    setProgressiveIncrement(betAmount){
        let incRate = 1/300; 
        for( let key of Object.keys(this.increaseAmount)) {
            (this.prize[key] !== 0) ? this.increaseAmount[key] = 0 : this.increaseAmount[key] += (betAmount*incRate*(key.substring(key.length -1, key.length)));
        }
        //console.log(this.prize,this.increaseAmount)

    }

    evaluateCurrentJackpotValues(){
        for(let i = 1; i < 6; i++){
            this.currentPrize["JP"+(i).toString()] = this.initialPrize["JP"+(i).toString()] + this.increaseAmount["JP"+(i).toString()]
        }
    }    

    evaluateTotalJackpotWin(){
        this.totalWinAmount += this.winAmount
    }

    clearRound(){
        this.roundCounter = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
        this.winAmount = 0
        this.prize = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};

    }

    print(){
        console.log(this.initialPrize,"\n",this.currentPrize,"\n",this.prize,"\n",this.winAmount,this.totalWinAmount,"\n",this.roundCounter,this.counterForAllRounds)
    }

    
}

module.exports = JackpotController

// let c= 2
// let b= 1

// let a = new JackpotController()
// a.print()
// a.updateJackpot(2,1)
// a.print()
// a.updateJackpot(4,1)
// a.print()

