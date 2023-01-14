class Symbol{
    constructor( ind = -1 ){
        this.symbolName = "";
        this.symbolIndex = ind;
        this.isLowSym = false;
        this.isLowestSym = false;
        this.isMidSym = false;
        this.isHighestSym = false;
        this.isWild = false;
        this.isSplitWild = false; 
    
       
    }

    updateSymbol(symName = ""){
        this.symbolName = symName;
        this.isLowSym = this.symbolName.includes("L") ?  true : false
        this.isLowestSym = this.isLowSym && this.symbolName.includes("0") ? true : false;
        this.isMidSym = this.symbolName.includes("M") ?  true : false;
        this.isHighestSym = this.isMidSym && this.symbolName.includes("3") ? true : false;
        this.isWild = this.symbolName.includes("W") ?  true : false;
       
    }
    

    
    printSym(){
        console.log("Symbol",this.symbolIndex, "-)SymName = ", this.symbolName)
    }
    

}



module.exports = Symbol


