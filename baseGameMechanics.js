const BaseGameSlot = require("./baseGameSlot");
const  {loadJson} = require("./helpers");


class BaseGameMechanism{
    bet = 1;

    constructor(){
        this.winlines = [];
        this.paymentsym = [];
        this.payment = [];
        this.roundPayment = 0;
        this.totalPaymentWinlines = 0;
        this.slot = [[]];
        this.fsCount = 0;//shows number of "Free spin" symbol per round
        this.sCount = 0; //shows total num of "scatter" symbol. 
        this.countSforFeature = 0;       
        this.jcount = 0;
        this.JackpotSymFromCurrReels=[];

        this.getSlot(); 

    }

  

    getSlot(){
        this.slot = new BaseGameSlot()
        this.slot.setReels()
    }
    
    updateSpin(){
        this.slot.spin();
    }

    setPaytable(){
        let symJson = loadJson("baseReelSymbols");
        this.paymentsym = symJson.BaseSym;
    }

    paylines(){
        let curIterSym = "" ;
        let paylines =  [
         
            [0,0,0,0,0],[1,1,1,1,1], [2,2,2,2,2],
            [0,1,2,1,0],[0,2,1,2,0],[2,1,0,1,2],[2,0,1,0,2],[1,2,0,2,1],[1,0,2,0,1],
            [1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[2,0,0,0,2],[0,2,2,2,0],
            [0,0,1,2,2],[2,2,1,0,0],[2,1,0,2,1],
            [0,1,0,1,0],[2,1,2,1,2],[0,2,0,2,0],[2,0,2,0,2],[1,0,1,0,1],[1,2,1,2,1],
            [1,1,0,1,1],[1,1,2,1,1],[0,0,2,0,0],[2,2,0,2,2],[0,0,1,0,0],[2,2,1,2,2],
        ];
        this.winlines = []

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
                this.winlines.push([sym,count,payline]);

            }
        };

     
    }

    paytable(){
        this.payment = [];
        let payout = 0;
        let paytable=[
                [0,0,0.2,0.4,1.0], //l0
                [0,0,0.2,0.4,1.5], //l1
                [0,0,0.4,0.8,2.0], //l2
                [0,0,0.4,0.8,2.5], //l3
                [0,0,0.6,1.0,5.0], //m0
                [0,0,0.6,2.0,10.0], //m1
                [0,0,1.0,4.0,15.0], //m2
                [0,0,2.0,6.0,20.0], //m3
               
            ];
        for(let payline of this.winlines){
            let s = payline[0];
            let cs = payline[1];
            let ind = this.paymentsym.indexOf(s);
            //console.log(cs,s,ind)
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
    }
    roundPayoutfromWinline(){
        // ROUND PAYOUT SHOWS THE TOTAL PAYOUT OF X NUMBER OF WINLINES FOR A ROUND. 
        // IF SCATTER SYMBOL APPEARS MORE THAN ONE IN A ROUND, TOTAL PAYOUT IS MULTIPLIED BY NUMBER OF SCATTER SYMBOL  
        // CHANGE PAYOUT AMOUNT DUE TO FEATURE ALSO EVALUATED HERE.
        this.roundPayment = 0;
        for(let pay of this.payment){
            this.roundPayment += (pay[2]);
        }
    }
 
    totalPayoutfromWinlines(){
        //TOTAL PAYOUT FOR N ROUNDS.
        this.totalPaymentWinlines += this.roundPayment  
    }
    
    countJackpotSymbol(){
        this.jcount = 0;
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                let sym = this.slot.getReel(i).getSymbol(j)
                if(sym.isJackpot){
                    this.jcount++
                }
            }
        }        
    }

    countFreeSpin(){
        this.fsCount = 0;
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                let sym = this.slot.getReel(i).getSymbol(j)
                if(sym.isFreeSpin){
                    this.fsCount++
                }
            }
        }
    }

    countScatter(){
        this.sCount = 0;
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                let sym = this.slot.getReel(i).getSymbol(j)
                if(sym.isScatter){
                    this.sCount++
                }
            }
        }
    }


  

    

}


module.exports = BaseGameMechanism

// // let m = new BaseGameMechanism()
// // console.log(m.slot.getReel(1).getSymbol(1).symbolName, m.fsCount, m.freeSpinGame, m.paymentsym,"++","\n", m.freeSpinGame.lastResult)

