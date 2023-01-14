const SpaceMonkey = require("./spaceMonkeyFeature")
const Fighters = require("./SymbolFight/generateFighters")
class AllFeatures{
    feature;

    constructor(iSM=false,iF=false){
        this.featureAveragePayment = 0;

        this.featureTotalPayment = 0;
        this.countFeatureSym = 0
        this.roundFeaturePayment = 0;
        this.numOfFeatureActivated = 0;

        this.isSpaceMonkey = iSM;
        this.isFighters = iF; 

        this.chooseFeature()

    }

    updateFeature(counts){
        this.featureAveragePayouts();
        this.numOfInitFeature(counts);
        this.totalFeaturePayout();
    }
    chooseFeature(){
        this.isSpaceMonkey ? this.feature = new SpaceMonkey() : this.isFighters ? this.feature = new Fighters(true) : this.feature = {};
    }
    featureAveragePayouts(){
        this.isSpaceMonkey ? this.featureAveragePayment = this.feature.crash : this.isFighters ? this.featureAveragePayment = this.feature.averageWin : this.featureAveragePayment=0;
    }
    numOfInitFeature(counts){
        this.countFeatureSym += counts;
        if(this.countFeatureSym >= 10){
            this.roundFeaturePayment = this.featureAveragePayment;
            this.countFeatureSym-=10
            this.numOfFeatureActivated++
        }
        else{
            this.roundFeaturePayment = 0;
        }
    }
    totalFeaturePayout(){
        this.featureTotalPayment += this.roundFeaturePayment;
    }
}

module.exports = AllFeatures;

// m = new AllFeatures(true,false);
// m.updateFeature(12);
// console.log(m)
// m.updateFeature(8)
// console.log(m)