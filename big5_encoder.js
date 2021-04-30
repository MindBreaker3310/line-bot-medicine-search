const iconv = require('iconv-lite')


function big5_encode(chr) {
    let isEng = new RegExp("[A-Za-z]+");
    if (isEng.test(chr)) {
        return chr
    }
    
    let rtn = "";
    let buf = iconv.encode(chr, 'big5')
    for (let i = 0; i < buf.length; i += 2) {
        rtn += '%' + buf[i].toString(16).toUpperCase();
        if ((buf[i + 1] >= 65 && buf[i + 1] <= 90) || (buf[i + 1] >= 97 && buf[i + 1] <= 122)) {
            rtn += String.fromCharCode(buf[i + 1])
        } else {
            rtn += '%' + buf[i + 1].toString(16).toUpperCase();
        }
    }
    return rtn;
}

// big5_encode('安') ==> %A6w
// console.log(big5_encode('max測試'));
module.exports = big5_encode
