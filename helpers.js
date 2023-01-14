function loadJson(jsonFileName){
    jsonObjs = require('./'+jsonFileName+'.json')
    return jsonObjs
}

function getIndexByWeight(arr, val){
    let tot = 0;
    let i = 0;
    do{
        tot += arr[i];
        i++;
    }while(tot <= val)
    
    return i > 0 ? i-1 : 0;
}

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const arrayColumn = (arr, n) => arr.map((x) => x[n]);

function getRandomFloat(min, max, decimals) {
    return parseFloat(Math.random() * (max - min) + min).toFixed(decimals);
}

module.exports = {loadJson,generateRandomIntegerInRange,getRandomFloat,getIndexByWeight};

a = 4000;
b=1
d =2
let red = 0;
let green = 0;
let tot = 0
let avg = 0;
let max = 0;
let r = 100000
let redyuzde ;
let greenyuzde ; 
let cr;
let number = 1; 
for (let i = 0; i<r; i++){
    number = parseFloat(getRandomFloat(b,a-1,d))
    cr = 0.98*a/((a-number))
    if(cr < 1.97){
        red++
        cr = 1
    }
    else{
        green++
    }
    max = (number > max ? number : max)
    tot += cr
}
avg = tot/r
redyuzde = (red/r)*100
greenyuzde =(green/r)*100

console.log(typeof number ,"red%",redyuzde,"green%",greenyuzde,"avg",avg,"max",max)