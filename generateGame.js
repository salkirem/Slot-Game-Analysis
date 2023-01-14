const GenerateBaseGame = require("./generateBaseGame")
const freeSpinGame = require("./freeSpinController");
const AllFeatures = require("./chooseFeature")

class GenerateSlotGame{
    baseGame;
    numOfPlayedRound = 0;

    featureGame;
    fsGame;
  

    

    constructor(){
        this.getSlotGame();
        this.getFeature();

        this.freespinReels = [[]];
        this.totalfreeSpinPayment = 0;
        this.roundfreeSpinPayment = 0;
        this.numOffreeSpinGame = 0;
        this.totalRoundPlayed = 0;
        

        this.featurePayment = 0;
        this.roundFeaturePayment = 0;
        this.roundJackpotPayment = 0;
        this.totalJackpotPayment = 0;
        this.jackpotPrizes = {};
        this.numOfJackpotWin = {};


        this.totalpayment = 0;
    }

    getSlotGame(){
        this.baseGame = new GenerateBaseGame();
        this.fsGame = new freeSpinGame();
        
    }

    generateRounds(){
        this.roundPlayed();
        this.baseGameRun();
        this.updateFeatureGame();
        this.featurePayout();
        this.freespinRun();
        this.jackpotResults();
        this.totalPayoutAllIncluded();
 

    } 

    baseGameRun(){
        // BASE GAME START
        this.baseGame.generateBaseSlot();  
    }

    freespinRun(){
        // FREESPIN ROUNDS START IN THHIS FUNCTION ACCORDING TO GIVEN CONDITION.
        // RESULT OF THE FS GAME CALCULATED IN HERE

        this.roundfreeSpinPayment  = 0;
        this.fsGame.landedSymbolsOnStart = this.baseGame.fsCount;

        if (this.baseGame.fsCount>2){ 
            this.numOffreeSpinGame++
            this.fsGame.generateFS();
            this.freespinReels = this.fsGame.reels;
            this.roundfreeSpinPayment = this.fsGame.lastResult
            this.totalfreeSpinPayment += this.roundfreeSpinPayment;
            this.totalRoundPlayed = this.fsGame.playedCount;
        }
    }

    

    roundPlayed(){
        // Number of base game round
        this.numOfPlayedRound ++ 
    }
 

    totalPayoutAllIncluded(){
        this.totalpayment = this.baseGame.totalPaymentWinlines + this.totalFeaturePayment + this.totalfreeSpinPayment + this.totalJackpotPayment
    }

    getFeature(){
        // due to True-False condition, AllFeature class selects one of the feature and the feature is included the game by this func
        this.featureGame = new AllFeatures(true,false);
    }

    updateFeatureGame(){
        this.featureGame.updateFeature(this.baseGame.sCount)
    }

    featurePayout(){
        this.totalFeaturePayment = this.featureGame.featureTotalPayment;
        this.roundFeaturePayment = this.featureGame.roundFeaturePayment;
        // console.log(this.featurePayment,this.featureGame.featureTotalPayment,this.featureGame.roundFeaturePayment,this.featureGame.countFeatureSym,this.featureGame.numOfFeatureActivated)
    }

    jackpotResults(){
        this.roundJackpotPayment = this.baseGame.jackpot.winAmount
        this.totalJackpotPayment = this.baseGame.jackpot.totalWinAmount;
        this.jackpotPrizes = this.baseGame.jackpot.prize;
        this.numOfJackpotWin = this.baseGame.jackpot.counterForAllRounds;
        // console.log(this.jackpotPrizes["JP1"])
    }
   

    
}
module.exports = GenerateSlotGame

// let a = new GenerateSlotGame()
// a.generateRounds()
// console.log(a)