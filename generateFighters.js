const FeatureGameMechanism = require("./featureGameMechanics")

class Figthers extends FeatureGameMechanism{
    averageWin = 16.12 
    constructor(r){
        super(r);
        this.victory = false;
        this.winningSide;
        this.counts ;
        this.numOfplayedRound = 0;
        
    }

    generateOneRound(){
        this.setPaytable();
        this.paylines();
        this.setWinlinlines();
        this.paytable();
        this.setMultiplier();
        this.roundPayoutfromWinline();
        this.roundPayoutWithMultCoeff();
        this.totalFeaturePayout();
        this.setHealthBars();     
        this.whoWin();
        this.setSpinCounter();
        this.updateSpin();
        this.numOfplayedRound++



    }

    

    generateFeatureSlot(){
        // console.log(" \n \nis Figther of Low ? " ,this.isFighterOfLow)
        while(this.playedCount > 0){
            this.generateOneRound();
            // console.log("spin", this.playedCount,"health Low", this.healthOfLows,"wins",this.winlines, "low win",this.winlinesLow,"health mid", this.healthOfMids,"dam low:", this.winlinesMid.length,"dam mid", this.winlinesLow.length,"round pay", this.roundPayment,this.roundPaymentWithMultiplier,"mult", this.multiplierCoeff, "\ntotoal:",this.totalFeaturePayment)
        }

    }

    clearOldFeatureGame(){
        this.winlines = [];
        this.winlinesMid = [];
        this.winlinesLow = [];

        this.paymentsym = [];
        this.payment = [];

        this.roundPayment = 0;
        this.roundPaymentWithMultiplier = 0;
        this.totalFeaturePayment = 0;
        this.healthOfLows = 5;
        this.healthOfMids = 5;

        this.playedCount = 3;

        this.multiplierCoeff = 0;
        this.numOfplayedRound = 0;

        this.slot = [[]];
        this.getSlot(); 

        this.winningSide;
        this.counts ;

    }

    whoWin(){
        let c = {la: 0 , ma : 0 , md: 0, ld : 0}
        if(this.healthOfLows == 0 && this.healthOfMids > 0){
            if(this.isFighterOfLow){
                this.victory = false;
                this.winningSide = "Enemy Wins: Mids"
                c.md += 1

            }
            else{
                this.victory = true;
                this.winningSide = "Alliance Wins: Mids"
                c.ma +=1
            }
        }
        if(this.healthOfLows > 0 && this.healthOfMids == 0){
            if(this.isFighterOfLow){
                this.victory = true;
                this.winningSide = "Alliance Wins: Lows"
                c.la +=1
            }
            else{
                this.victory = false;
                this.winningSide = "Enemy Wins: Lows"
                c.ld +=1
            }
        }
        if(this.healthOfLows == 0 && this.healthOfMids == 0){
            this.victory = false;
            this.winningSide = "NoOne"
        }
        this.counts = c
        
    }
    
}
module.exports = Figthers;

// let r = 10000000
// let c = {la: 0 , ma : 0 , md: 0, ld : 0}
// let p = 0
// let pr = 30
// let pt = 0
// a=0;
// b=0;


// let m = new Figthers();

// for(i = 0; i < r ; i++){
//     m.generateFeatureSlot()
//     c.la += m.counts.la
//     c.ld += m.counts.ld
//     c.ma += m.counts.ma
//     c.md += m.counts.md
//     b += m.totalFeaturePayment
//     a += m.numOfplayedRound
//     p = (p > m.roundPayment)? p : m.roundPaymentWithMultiplier;
//     pr = (pr > m.roundPayment) ? m.totalFeaturePayment : pr;
//     pt = (pt > m.totalFeaturePayment)? pt : m.totalFeaturePayment;

//     // console.log("\n\n\n","countFeature : ", i,"num of round :",m.numOfplayedRound,"health Low:",m.healthOfLows,"mult:",m.multiplierCoeff,"healt mid",m.healthOfMids,"round pay",m.totalFeaturePayment,"\n",c,p,pr)
//     m.clearOldFeatureGame()
// }

// let avgperSpin = b/a;
// let avgperRound = a/r;
// console.log("\n\n\n","*total num of feature game: ",r,"num of round :",a,"\n","symbol wins" , c,"total payout",b)

// console.log("avg win per Round",avgperRound,"avg win per Spin",avgperSpin)
// console.log(pt,p,pr)