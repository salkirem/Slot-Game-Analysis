import numpy as np
import random as rd
import json

weights = ["E","1X","2X","3X","4X","5X","6X","7X","8X","9X","10X","20X","50X","100X","M","MH","MV"]
symbols =[6000,40,50,40,30,20,15,10,8,5,4,3,2,1,20,30,20] 

total = np.sum(symbols)
probability = np.divide(symbols,total)
reelset = rd.sample(weights,total,counts=symbols)
print(total)

fs = {  
    # "lFeatureSym" :  lFeatureSym, 
    "reelset" : reelset ,
} 
with open(' FSSSReelSet.json','w') as  f:
        rs =json.dump(fs,f,indent=4)
        print(".")