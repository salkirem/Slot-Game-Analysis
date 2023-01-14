const GenerateSlotGame = require("./generateGame");
const  {loadJson} = require("./helpers")
const _ = require("lodash")


class StatisticalAnalysis{
    round = 10000000
    gameRun;
    rtp;
    netpayment;
    hit = {};
    probOfHittingSym = {};
    hitFrq;

    maxBasePayout = 0;

    variance;
    stdDev;
    volatility;
    maxFSpayment = 0;
    jackpotPrizeMax = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
    jackpotPrizeTot = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};
    jackpotPrizeAvg = {"JP1": 0, "JP2": 0, "JP3": 0, "JP4": 0, "JP5": 0};


    constructor(){
        this.avgFsspin = 0;
        this.avgFsPayment = 0;
        this.hitSym = [] ;
        this.sqrOfEach = 0;
        this.avgWinPerSpin = 0; 
        this.getSlotGame()
        this.setHits()
        this.statisticalCalculations()
    
    }

    getSlotGame(){
        this.gameRun = new GenerateSlotGame()
    }

    statisticalCalculations(){
        for(let r = 0; r < this.round; r++){
            this.gameRun.generateRounds();
            this.getHits();
            this.probabilityOfHitting();
            this.hitFrequency();
            this.calculateRtp();
            this.calculateVariance();
            this.calculateStdDev();
            this.calculateVolatility();
            this.baseGameAnalysis();
            this.freeSpinAnalysis();
            //if(this.gameRun.jackpotPayment > 0){console.log(this.gameRun.baseGame.reelsArr, this.gameRun.jackpotPayment)}

            this.jackpotAnalysis();
            //if(this.gameRun.roundfreeSpinPayment > 50){console.log(this.gameRun.roundfreeSpinPayment)}
            // console.log("***",this.gameRun.jackpot.initialPrize, "prize obj",this.gameRun.jpPrize,"inc amt", this.gameRun.incAmount,"win", this.gameRun.jackpotPayment)

            // this.print();
            // if(this.gameRun.jackpotPayment>0){console.log(r,this.gameRun.jackpotPayment,this.gameRun.incAmount)
            // }
            
        }
        
    }

    setHits(){
        let r = loadJson("baseReelSymbols");
        this.hitSym = r.Hits
        for (let s of this.hitSym){
            this.hit[s] = 0
        }
    }

    getHits(){ //NUMBER OF HITS ARE CALCULATED AS FOLLOWS. 3D ARRAY TYPE FOR SYMBOLS WHICH GIVE PAYOUT AND NUMBER TYPE FEATURE SYMBOLS
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                let sym = this.gameRun.baseGame.slot.getReel(i).getSymbol(j)
                if (sym.isWild ||sym.isScatter || sym.isFreeSpin || sym.isJackpot){
                    this.hit[sym.symbolName] += 1
                }
            }
        }
        for(let payline of this.gameRun.baseGame.winlines){
            let sym = payline[0];
            let c = payline[1];
            this.hitSym.forEach(hs => {
                (c == parseInt(hs.substring(hs.length -1, hs.length)) && sym == hs.substring(0, 2)) ? this.hit[hs] += 1 : this.hit[hs] +=0;
            })   
        }
    }
    probabilityOfHitting(){
        for (let [symName, symCount] of Object.entries(this.hit)) {
            this.probOfHittingSym[symName] = symCount/this.round;
          }
    }
    hitFrequency(){
        //shows the probability of hitting a payouted symbol in a spin round of base game.
        let getHitPayoutedSym = {};
        for(let key of Object.keys(this.hit)){
            if(key.includes("L")||key.includes("M")){
                getHitPayoutedSym[key]=this.hit[key];
            }
        }
    
        let hitValue = Object.values(getHitPayoutedSym);
        let totHitVal = _.sum(hitValue);

        this.hitFrq = totHitVal/this.round; 
    }
    calculateRtp(){
        this.netpayment = (this.gameRun.totalpayment)
        this.rtp = (this.netpayment/this.round)*100
    }
    calculateVariance(){
        let totRoundPayment = this.gameRun.baseGame.roundPayment + this.gameRun.roundfreeSpinPayment + (this.gameRun.roundFeaturePayment) + this.gameRun.roundJackpotPayment
        this.sqrOfEach += Math.pow(( totRoundPayment - this.avgWinPerSpin),2)
        //  += Math.pow(winBase,2) + Math.pow(winfreeSpin,2) + Math.pow(winJp,2);
        this.avgWinPerSpin = this.gameRun.totalpayment/this.round;
        this.variance = (this.sqrOfEach)/this.round;
        // console.log(this.sqrOfEach,"-----------",this.avgWinPerSpin)

    }

    calculateStdDev(){
        this.stdDev = Math.sqrt(this.variance)
    }

    calculateVolatility(){
        this.volatility = this.stdDev*(1.64)
    }

    freeSpinAnalysis(){
        this.avgFsspin = this.gameRun.totalRoundPlayed/this.gameRun.numOffreeSpinGame
        this.avgFsPayment = this.gameRun.totalfreeSpinPayment/this.gameRun.numOffreeSpinGame
        this.maxFSpayment = (this.gameRun.roundfreeSpinPayment > this.maxFSpayment) ? this.gameRun.roundfreeSpinPayment : this.maxFSpayment;
    }
    jackpotAnalysis(){
        let currJackpotPrize = this.gameRun.jackpotPrizes;
        Object.keys(currJackpotPrize).forEach((key) => {
            this.jackpotPrizeMax[key] = (this.jackpotPrizeMax[key] > currJackpotPrize[key]) ? this.jackpotPrizeMax[key] : currJackpotPrize[key];
            this.jackpotPrizeTot[key]+= currJackpotPrize[key];
            this.jackpotPrizeAvg[key] = this.jackpotPrizeTot[key]/this.gameRun.numOfJackpotWin[key]

        })
    }
    baseGameAnalysis(){
        this.maxBasePayout = (this.maxBasePayout > this.gameRun.baseGame.roundPayment) ? this.maxBasePayout : this.gameRun.baseGame.roundPayment;

    }

    print(){
        
        console.log("\n ----STATISTICAL RESULTS---- \n ","Hit :",this.hit, "\n Probability of hitting a symbol that has payout : \n  ",this.probOfHittingSym, "\n Hit frequency : ", this.hitFrq)
        console.log("\n **Variance** :", this.variance, " \n **Std dev** :", this.stdDev , " \n **Volatility** : ", this.volatility, "\n RTP :", this.rtp,"\n ------------") 
        console.log("\n ----PAYMENTS----  \n","\n Total payment :",this.gameRun.totalpayment, " \n Bonus payment : ", this.gameRun.totalfreeSpinPayment, "\n Jackpot Payment : ", this.gameRun.totalJackpotPayment, "\n Base Payment : ", this.gameRun.baseGame.totalPaymentWinlines, "\n Feature Payment : ", this.gameRun.totalFeaturePayment, "\n\n NUMBER OF ROUNDS :",this.round)
        console.log("\n ADDITIONAL INFO ABOUT FREESPIN AND FEATURE \n"," Num of FS", this.gameRun.numOffreeSpinGame, "avg fs round  : ", this.avgFsspin,"avg fs payment :", this.avgFsPayment, "fs max :",this.maxFSpayment,"number of activating feature:" ,this.gameRun.featureGame.numOfFeatureActivated )
        console.log("\n num of JP",this.gameRun.numOfJackpotWin,"AVG JP PRIZE", this.jackpotPrizeAvg,"TOT JP PRIZE", this.jackpotPrizeTot, "MAX JP PRIZE", this.jackpotPrizeMax)

    }

}

a = new StatisticalAnalysis()
a.print()
