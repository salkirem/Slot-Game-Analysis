const BaseGameMechanism = require("./baseGameMechanics")
const JackpotController = require("./jackpot")

class GenerateBaseGame extends BaseGameMechanism{
    jackpot;
    constructor(){
        super();
        this.getJackpot()
        this.generateBaseSlot()
    }

    generateBaseSlot(){
        this.updateSpin();
        this.setPaytable();
        this.countFreeSpin();
        this.countScatter();
        this.countJackpotSymbol();
        this.countJackpotSymbol();
        this.paylines();
        this.paytable();
        this.roundPayoutfromWinline();
        this.totalPayoutfromWinlines();
        this.updateJackpots();
        
    }

    getJackpot(){
        this.jackpot = new JackpotController();
    }
    updateJackpots(){
        this.jackpot.updateJackpot(this.jcount,this.bet)
    }

    
}

module.exports = GenerateBaseGame;


// let m = new GenerateBaseGame()
// console.log(m)
// console.log(m.slot.getReel(1).getSymbol(1).symbolName, m.fsCount)




