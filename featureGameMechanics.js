const FeatureGameSlot = require("./featureGameSlot");
const  {loadJson} = require("./helpers");


class FeatureGameMechanism{

    constructor(r = false){
        this.isFighterOfLow = r;
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


        this.slot = [[]];
        this.getSlot(); 

    }
    getSlot(){
        this.slot = new FeatureGameSlot()
        this.slot.setReels()
    }

  
    
    updateSpin(){
        this.slot.spin();
    }

    setPaytable(){
        let symJson = loadJson("featureReelSymbols");
        this.isFighterOfLow ? this.paymentsym = symJson.featureLow :this.paymentsym = symJson.featureMid ;
    }

    paylines(){
        let curIterSym = "" ;
        let paylines =  [
         
            [0,0,0,0,0],[1,1,1,1,1], [2,2,2,2,2],
            [0,1,2,1,0],[0,2,1,2,0],[2,1,0,1,2],[2,0,1,0,2],[1,2,0,2,1],[1,0,2,0,1],
            [1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[2,0,0,0,2],[0,2,2,2,0],
            [0,0,1,2,2],[2,2,1,0,0],
            [0,1,0,1,0],[2,1,2,1,2],[0,2,0,2,0],[2,0,2,0,2],[1,0,1,0,1],[1,2,1,2,1],
            [1,1,0,1,1],[1,1,2,1,1],[0,0,2,0,0],[2,2,0,2,2],[0,0,1,0,0],[2,2,1,2,2],
        ];
        this.winlinesMid = [];
        this.winlinesLow = [];

        for(let payline of paylines) {

            let count = 0;
            let lastEvSym = "";
            let sym = "";
            for(let [col,row] of payline.entries()){
                let curSymObj = this.slot.getReel(col).getSymbol(row)
                curIterSym = curSymObj.symbolName
            
                if(curSymObj.isWild||curSymObj.isLowSym || curSymObj.isMidSym){
                    if(lastEvSym == ""||(curSymObj.isWild && count == 0)||(sym != "W" && !curSymObj.isWild && curIterSym == lastEvSym)||(sym == "W" && !curSymObj.isWild)){
                    lastEvSym = sym = curIterSym;
                    count++
                    }
                    else if((sym != "W" && curSymObj.isWild)||(sym != "W" && !curSymObj.isWild && (curIterSym != lastEvSym && lastEvSym == "W") && sym == curIterSym)||(sym==curIterSym==lastEvSym=="W")){
                        lastEvSym = "W";
                        count++;

                    }
                    else {
                        break;
                    }
                }    
            }
            if (count > 2) { 
                if(sym.includes("L"))  {
                    this.winlinesLow.push([sym,count,payline])
                } 
                if( sym.includes("M")) {
                    this.winlinesMid.push([sym,count,payline])
                } 

            }
        };

     
    }

    setWinlinlines(){
        this.winlines = [];
        this.isFighterOfLow ? this.winlines = this.winlinesLow : this.winlines = this.winlinesMid;

    }

    paytable(){
        this.payment = [];
        let payout = 0;
        let paytable=[];
        this.isFighterOfLow ? paytable = [
            //[0,0,0.2,0.4,1.0], //l0
            [0,0,0.2,0.4,1.5], //l1
            [0,0,0.4,0.8,2.0], //l2
            //[0,0,0.4,0.8,2.5], //l3
            
           
        ] : paytable = [
            //[0,0,0.6,1.5,5.0], //m0
            [0,0,0.6,2.0,10.0], //m1
            [0,0,1.0,4.0,15.0], //m2
            //[0,0,2.0,6.0,20.0], //m3
           
        ] 
        let ind;
        for(let payline of this.winlines){
            let s = payline[0];
            let cs = payline[1];
            ind = this.paymentsym.indexOf(s);
            //console.log(cs,s,ind)
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
    }
    roundPayoutfromWinline(){
        this.roundPayment = 0;
        for(let pay of this.payment){
            this.roundPayment += (pay[2]);
        }
    }

    roundPayoutWithMultCoeff(){
        this.roundPaymentWithMultiplier = this.roundPayment*this.multiplierCoeff
    }
 
    totalFeaturePayout(){
        //TOTAL PAYOUT FOR N ROUNDS.
        this.totalFeaturePayment += this.roundPaymentWithMultiplier
    }

    setHealthBars(){
        let damageToLows = this.winlinesMid.length;
        let damageToMids = this.winlinesLow.length;
        if(this.healthOfLows > 0 && this.healthOfMids > 0){
            this.healthOfMids -= damageToMids 
            this.healthOfLows -= damageToLows
        }
        // if(this.healthOfLows >0 && this.healthOfMids == 0){
        //     this.healthOfLows -=0
        // }
        // if(this.healthOfMids >0 && this.healthOfLows == 0){
        //     this.healthOfMids -=0
        // }

        if(this.healthOfLows < 0){this.healthOfLows = 0}
        if(this.healthOfMids < 0){this.healthOfMids = 0}

    }



    setMultiplier(){
        // this.isFighterOfLow ? this.multiplierCoeff += this.winlinesLow.length : this.multiplierCoeff += this.winlinesMid.length;
        this.multiplierCoeff += this.winlines.length
        if(this.multiplierCoeff > 5) {
            this.multiplierCoeff = 5;
        }
        
    }

    setSpinCounter(){
        if(this.isFighterOfLow){
            if(this.healthOfLows>0){ 
                this.healthOfMids === 0 ? this.playedCount -=1 : this.playedCount = 3;
            }
            else{
                this.playedCount = 0;
            }
        }
        else{
            if(this.healthOfMids>0){
                this.healthOfLows === 0 ? this.playedCount -=1 : this.playedCount = 3;

            }
            else{
                this.playedCount = 0;
            }
        }


        // setSpinCounter(){
        //     this.isFighterOfLow ? (this.healthOfLows>0 ? decreasePlayCount(this.healthOfMids,this.playedCount) : this.playedCount = 0) : (this.healthOfMids>0 ? decreasePlayCount(this.healthOfLows,this.playedCount) : this.playedCount = 0)       
        //     function decreasePlayCount(pc, dpd){
        //         if(dpd == 0){
        //             pc -= 1
        //         }
        //     }
        // }
        
    }

    

}


module.exports = FeatureGameMechanism


// console.log(m.slot.getReel(1).getSymbol(1).symbolName, m.fsCount, m.freeSpinGame, m.paymentsym,"++","\n", m.freeSpinGame.lastResult)
