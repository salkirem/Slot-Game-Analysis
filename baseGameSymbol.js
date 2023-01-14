class Symbol{
    constructor( ind = -1, iBs = false, ){
        this.symbolName = "";
        this.symbolIndex = ind;
        this.isBaseSym = iBs;
        this.isLowSym = false;
        this.isLowestSym = false;
        this.isMidSym = false;
        this.isHighestSym = false;
        this.isWild = false;
        this.isSplitWild = false; 
        this.isScatter = false;
        this.isFreeSpin = false
        this.isJackpot = false;
    
       
    }

    updateSymbol(symName = ""){
        this.symbolName = symName;
        this.isLowSym = (this.isBaseSym ) && this.symbolName.includes("L") ?  true : false
        this.isLowestSym = this.isLowSym && this.symbolName.includes("0") ? true : false;
        this.isMidSym = (this.isBaseSym ) && this.symbolName.includes("M") ?  true : false;
        this.isHighestSym = this.isMidSym && this.symbolName.includes("3") ? true : false;
        this.isWild = (this.isBaseSym ) && this.symbolName.includes("W") ?  true : false;
        this.isScatter = (this.isBaseSym ) && (this.symbolName == "S") ?  true : false;
        this.isFreeSpin = this.isBaseSym && this.symbolName.includes("FS")? true : false;
        this.isJackpot = this.isBaseSym && this.symbolName.includes("JP")? true : false;
    }
    

    
    printSym(){
        console.log("Symbol",this.symbolIndex, "-)SymName = ", this.symbolName)
    }
    

}



module.exports = Symbol


