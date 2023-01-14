const { generateRandomIntegerInRange, getIndexByWeight } = require("./helpers");


class freeSpinReelset{
    reelset = [];
    //E:Empty, M:Random Merge, MV:Merge-Vertical, MV:Merge-Horizontal, JP1: MINI JACKPOT, JP2: MINOR JACKPOT, JP3: MAJOR JACKPOT, JP4:MEGA JACKPOT 
    weights = ["E","1X","2X","3X","4X","5X","6X","7X","8X","9X","10X","20X","50X","100X","M","MH","MV","JP1","JP2","JP3","JP4"]
    symbols =[12750,150,125,60,50,40,30,20,15,9,6,3,2,1,10,5,6,35,17,6,2]// [13000,140,80,50,45,35,15,9,7,5,4,3,2,1,7,5,5,33,15,7,3] 

    total = 0;
    counter = 0;
    constructor(){
         this.symbols.forEach(n => this.total += n);
        //  console.log("total symbols:" , this.total);
         this.reelset = this.distribute();
    }

    distribute(){
        var rs = [];
        var symCounts = Object.assign({},this.symbols);
        for(let i = 0; i < this.total; i++){
            let ind, rndVal = 0;
            do{
                rndVal = generateRandomIntegerInRange(0, this.total-1);
                ind = getIndexByWeight(this.symbols, rndVal);
            }while(symCounts[ind] == 0)

            symCounts[ind]--;
            rs.push(this.weights[ind]);
        }
        return rs;
    }
}

module.exports = freeSpinReelset;

fsr = new freeSpinReelset()
const dictstring = JSON.stringify(fsr.reelset)
// console.log(dictstring)
var fs = require('fs');
fs.writeFile("thing.json", dictstring, function(err, result) {
    if(err) console.log('error', err);
});



