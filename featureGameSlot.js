const FeatureGameReel = require("./featureGameReel")

class FeatureGameSlot{

    constructor(){
        this.reels = [[]];
        this.setReels();
        this.getReel();
        this.spin();
        this.numOfReels = 5;
    }

    setReels(){
        this.reels = [];
        for(let i = 0; i < this.numOfReels ; i ++){
            let r = new FeatureGameReel(i) 
            this.reels.push(r);
        }
    }

    getReel(reelInd){
        return this.reels[reelInd];
    }

    spin(){
        this.reels.forEach((r)=> {
            r.updateReel();
        })
    }

    printSlot(){
        console.log("--Slot-- reels = \n", this.reels);
    }
}

module.exports = FeatureGameSlot


// rls = new FeatureGameSlot()
// rls.setReels()
// console.log(rls.getReel(0).getSymbol(0));