const freeSpinReelset = require("./freeSpinreelset");
var path = require('path');
const fs = require('fs');
const util = require('util');
var outputPath = path.join(__dirname, '..', 'slots', './output.json');

const { generateRandomIntegerInRange,loadJson } = require("./helpers");

class freeSpinGame {
    reelXDim = 5;
    reelYDim = 5;
    reelCount = 25;

    freeSpinReelSet;
    reels = [];
    landedSymbolsOnStart = 3;
    spinCount = 3;
    playedCount = 0;
    lastResult = 0;
    
    


    constructor() {
        //console.log("freespin class initiated");
        this.getReels();
    }
    generateFS(){
        this.generateResult();
        // this.freeSpinWins();
    }

    // freeSpinWins(){
    //     this.lastResult = 0;
    //     this.reels.forEach(m => {
    //         if (m.includes("X")){
    //             this.lastResult += parseFloat(m.substring(0, m.length -1))
    //         }
    //     })
    //     console.log(this.lastResult)

    // }

    generateResult() {
        var result = [];
        this.spinCount = 3;
        let init = true;
        let lastRes = [];
        while (this.spinCount > 0) {
            let c = init ? [] : result[result.length - 1].reelsAfter;
            lastRes = this.generateRound(c);
            this.checkNewLanded(lastRes.landed) ? this.spinCount = 3 : this.spinCount--;
            this.playedCount++

            lastRes.spinCount = this.spinCount;
            lastRes.playedCount = this.playedCount;

            lastRes = this.evaluateMergeSymbols(lastRes);

            result.push(lastRes);
            init = false;

        }
        this.reels = lastRes.reelsAfter
        this.lastResult = 0;
        this.reels.forEach(m => {
            if (m.includes("X")){
                this.lastResult += parseFloat(m.substring(0, m.length -1))
            }
        })
        // console.log(this.lastResult)

        // console.log(this.reels)


    }

    checkNewLanded(arr) {
        return !(arr.filter(o => o == "").length == this.reelCount);
    }
    evaluateMergeSymbols(roundObject) {
        let positions = getSymPositions(roundObject.reelsAfter, "M", true);
        let mPositions;
        if (positions.length > 0) {
            positions.forEach(p => {
                switch (p.symbol) {
                    case "M":
                        mPositions = getSymPositions(roundObject.reelsAfter, "M");
                        
                        let xPositions = [];
                        for(let i = 0; i < roundObject.reelsAfter.length; i++){
                            if(roundObject.reelsAfter[i].includes("X")){
                                xPositions.push({pos: i, symbol: roundObject.reelsAfter[i]});
                            }
                        }

                        let pickedPositions = [];

                        let lim = xPositions.length < 3 ? xPositions.length : 3;
                        
                        //pick three spots that contains multipliers
                        for(let i = 0; i < lim; i++){
                            let val = -1;

                            do{
                                val = generateRandomIntegerInRange(0, xPositions.length - 1);
                            }while(pickedPositions.includes(val))
                            pickedPositions.push(val);
                        }

                        roundObject.pickedPositions = [];
                        pickedPositions.forEach(p => {
                            roundObject.pickedPositions.push(xPositions[p].pos);
                        })


                        let totVal = 0;

                        pickedPositions.forEach(p => {
                            let mult = xPositions[p].symbol;
                            totVal += parseInt(mult.substring(0, mult.length - 1), 10);
                            roundObject.reelsAfter[xPositions[p].pos] = "E";
                        })

                        roundObject.reelsAfter[p.yPos * this.reelYDim + p.xPos] = totVal.toString() + "X";

                        break;
                    case "MH":
                        mPositions = getSymPositions(roundObject.reelsAfter, "MH");
                        
                        let rowPositions = [];
                        mPositions.forEach(p => {
                            for(let i = p.yPos * this.reelYDim; i < p.yPos * this.reelYDim + this.reelXDim;i++){
                                if(roundObject.reelsAfter[i].includes("X"))
                                    rowPositions.push({pos: i, val: roundObject.reelsAfter[i]});
                            }

                            if(rowPositions.filter(r => r.val.includes("X")).length == 0){
                                roundObject.reelsAfter[p.yPos * this.reelYDim + p.xPos] = "E";
                                return;
                            }

                            let totVal = 0;
                            rowPositions.forEach(r => {
                                totVal += parseInt(r.val.substring(0, r.val.length -1));
                                roundObject.reelsAfter[r.pos] = "E";
                            })
                            roundObject.reelsAfter[p.yPos * this.reelYDim + p.xPos] = totVal.toString() + "X";
                        });
                        
                        
                        break;
                    case "MV":
                        mPositions = getSymPositions(roundObject.reelsAfter, "MV");
                        //console.log("JAMBALAYA");
                        let colPositions = [];
                        mPositions.forEach(p => {
                            for(let i = 0; i < this.reelYDim;i++){
                                let pstn = i * this.reelYDim + p.xPos;
                                // console.log( " position: ", pstn, " val: ", roundObject.reelsAfter[pstn]);
                                // console.log("reelsAfter: ", roundObject.reelsAfter);
                                if(roundObject.reelsAfter[pstn].includes("X")){
                                    // console.log("includes: ", roundObject.reelsAfter[pstn].includes("X"));
                                    // console.log("i: ", i, " reelDim ", this.reelYDim, " xPos: ", p.xPos,);
                                    colPositions.push({pos: pstn, val: roundObject.reelsAfter[pstn]});
                                }
                            }

                            //console.log("colpos: ", colPositions);
                            if(colPositions.filter(r => r.val.includes("X")).length == 0){
                                roundObject.reelsAfter[p.yPos * this.reelYDim + p.xPos] = "E";
                                return;
                            }

                            let totVal = 0;
                            colPositions.forEach(r => {
                                totVal += parseInt(r.val.substring(0, r.val.length -1));
                                roundObject.reelsAfter[r.pos] = "E";
                            })
                            roundObject.reelsAfter[p.yPos * this.reelYDim + p.xPos] = totVal.toString() + "X";
                        });
                        break;
                    default:
                        break;
                }
            });
        } 

        function getSymPositions(board, symName, inc = false) {
            let positions = [];
            for (let i = 0; i < board.length; i++) {
                let sym = board[i];
                if (inc ? sym.includes(symName) : sym == symName) {
                    let posData = {};
                    posData.xPos = i % 5;
                    posData.yPos = Math.floor(i / 5);
                    posData.symbol = sym;
                    positions.push(posData);
                }
            }
            return positions;
        }

        return roundObject;
    }

    generateRound(reels) {

        let roundObject = {};
        roundObject.reelsBefore = reels;
        roundObject.reelsAfter = [];
        roundObject.landed = [];

        //if this is the first spin
        if (roundObject.reelsBefore.length == 0) {
            //initialize reels and mark them empty
            roundObject = this.generateFirstRound(roundObject);
            return roundObject;
        }

        roundObject.landed = [];
        for (let i = 0; i < this.reelCount; i++) {
            // 
            let rN = roundObject.reelsBefore[i] == "E" ? generateRandomIntegerInRange(0, this.freeSpinReelSet.reelset.length - 1) : "";
            roundObject.landed.push(rN == "" ? "" : this.freeSpinReelSet.reelset[rN] == "E" ? "" : this.freeSpinReelSet.reelset[rN]);
            roundObject.reelsAfter[i] = roundObject.landed[i] != "" ? roundObject.landed[i] : roundObject.reelsBefore[i];
        }

        return roundObject;
    }

    generateFirstRound(roundObject) {
        //console.log("generating first round");
        for (let i = 0; i < this.reelCount; i++) {
            roundObject.reelsBefore.push("E");
            roundObject.reelsAfter.push("E");
            roundObject.landed.push("");
        }
        for (let i = 0; i < this.landedSymbolsOnStart; i++) {
            let rlI = -2;
            let genInd;
            do {
                rlI = generateRandomIntegerInRange(0, this.reelCount - 1);
            } while (roundObject.reelsBefore[rlI] !== "E")

            do {
                genInd = generateRandomIntegerInRange(0, this.freeSpinReelSet.reelset.length - 1);
                roundObject.reelsAfter[rlI] = this.freeSpinReelSet.reelset[genInd];
                roundObject.landed[rlI] = roundObject.reelsAfter[rlI];
            }
            while (roundObject.reelsAfter[rlI] == "E" && !this.freeSpinReelSet.reelset[genInd].includes("X"))
        }

        return roundObject;
    }

    initReels() {
        //manipulate reels here
        this.generateResult();
    }

    // async getReels() {
    //     try {
    //         getReelsets().then(d => {
    //             try {
    //                 this.freeSpinReelSet = JSON.parse(d);
    //                 this.initReels();
    //             } catch (err) {
    //                 //console.log("Data not found. Generating new data. Error: ", err);
    //                 this.generateReelsets();
    //                 this.initReels();
    //             }
    //         });
    //     } catch (err) {
    //         //console.log("Data not found. Generating new data. Error: ", err);
    //         this.generateReelsets();
    //         this.initReels();
    //     }
    // }

    // generateReelsets() {
    //     this.freeSpinReelSet = new freeSpinReelset();

    //     fs.writeFile(outputPath, JSON.stringify(this.freeSpinReelSet), () => {
    //         console.log("done writing file \n" + this.freeSpinReelSet);
    //     });
    // }

    getReels(){
        this.freeSpinReelSet = loadJson("output")
        this.initReels()
    }
}



module.exports = freeSpinGame;

// async function getReelsets() {
//     const readFileContent = util.promisify(fs.readFile);
//     return await readFileContent(outputPath);
// }

// let max = 0;
// let tot = 0;
// let totspin = 0;
// a = new freeSpinGame()
// let r = 50000000;
// for(let i =0 ; i < r; i++)
// {
//     a.generateFS()
//     max = (max > a.lastResult)? max : a.lastResult;
//     tot += a.lastResult ;
//     totspin += a.playedCount;
// }
// console.log(max, "avg win per spin", tot/totspin, "avg win per fs", tot/r)


