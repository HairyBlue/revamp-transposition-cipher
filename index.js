const asciiStart = 33
const asciiEnd = 126
const skipCode = [34, 92] // 34 = Double quotes , 92 = Backslash

let key = ""
let rows = [];


/**
 * 
 * @param {string} k
 * 
 */
function setKey(k) {
    if(k.length < asciiStart) key = k
    else console.warn("key legnth must not exceed 33")
}

/**
 * 
 * @param {string} text
 * @returns {string, null}
 */
function asciiEncrypt(text){
    try{
        let n = text.charCodeAt(0);
    
        for(let i = 0; i < key.length; i++){
          n++ 
          for(let v of skipCode)
            if(v == n) n++
        }
    
        if(n > asciiEnd){
         n = (n - asciiEnd) + asciiStart
         for(let v of skipCode)
           if(v == n) n++
        }
       
        return String.fromCharCode(n)
    }catch(e){
        console.error("Error expected from asciiEncrypt(text) --> ", text, "  topic: { encryption }" )
        console.log(e)
    }

}

/**
 * 
 * @param {number} ev 
 * @param {string} txt
 * @returns {string}
 */
function cb(ev, txt) {
    for(let i = 0; i < key.length; i++){
     for(let j = 0; j < rows.length; j++){
      if(i % 2 == ev){
        txt += asciiEncrypt(rows[j][i])
      }
     }
    }
 
 return txt
}

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
function encrypt(text) {
    try{
        rows = []
        text = text.replace(/\s|\t"/g, "")
        let idx = 0;
     
        for (let i = 0; i < text.length; i++) {
            let keyIndex = i % key.length;
            if (keyIndex == 0) rows.push([])
            if (rows[idx]?.length == key.length) idx++
            rows[idx]?.push(text[i])  
        }
        if(rows[idx]?.length != key.length){
            for(let j = rows[idx]?.length; j < key.length; j++){
                rows[idx]?.push("X")
            }
        }
    
       return cb(1, cb(0, ""))
    }catch(e){
        console.error("Error expected from encrypt(text) --> ", text, "  topic: { encryption }" )
        console.log(e)
    }

}



//********************************************************************************************************* */

/**
 * 
 * @param {string} text
 * @returns {string, null}
 */
function asciiDecrypt(text){
    try{
        let n = text.charCodeAt(0);
    
        for(let i = 0; i < key.length; i++){
        n--
        for(let v of skipCode){
            if(v == n) n--
        }
        }
        
        if(n == 32){
        n = asciiEnd
        }else if(n < asciiStart)
        {
        n =  asciiEnd - (asciiStart - n) + 1
        for(let v of skipCode)
        if(v == n) n--
        
        }
    
        return String.fromCharCode(n)
    }catch(e){
        console.error("Error expected from asciiDecrypt(text) --> ", text, "  topic: { decryption }" )
        console.log(e)
    }
}


/**
 * 
 * @param {number} ev 
 * @param {string} txt
 * @returns {string}
 */
function cb1(ev, txt) {
    for(let i = 0; i < key.length; i++){
         if(i % 2 == ev){
            txt += key[i]
        }
    }
    
    return txt
}

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
function decrypt(text) {
    try{
        rows = []
    
        const eKey = cb1(1, cb1(0, ""))
        let decrypt = ""

        const divide = text.length / key.length
        const regex = new RegExp(`.{1,${divide}}`,'g')
        const chunks = text.match(regex);

        for (let i = 0; i < key.length; i++){
            let temp = typeof eKey == "string" ? eKey.split("") : []
            let dText = chunks[temp.indexOf(key[i])].split("")
            rows.push(dText)
        }
        
        for (let k = 0; k < divide; k++){
            for (let j = 0; j < rows.length; j++){
            
                decrypt += asciiDecrypt(rows[j][k])
            }
        }
    
        return decrypt
    }catch(e){
        console.error("Error expected from decrypt(text) --> ", text, "  topic: { decryption }" )
        console.log(e)
    }
}

setKey("ME")

const msg = [
    "helloWorld123#@$% ",
    "MyOwnCypher435235_hello  loRem1psum   space nih"
    // add your unbreakable text here
]

for(let m of msg){
    console.log("**************************************************************************")
    console.info("Encrypted:  -->", encrypt(m))
    console.info("Decrypted   -->", decrypt(encrypt(m)))    
}