const CryptoJS = require('crypto-js');

const secretKey = process.env.SECRET_ENC_KEY; 

/**
 * @param {string} text - The text to encrypt.
 * @returns {string}- The encrypted text.
 */
const encryptText = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

/**
 * Decrypts the given text using the secret key.
 * @param {string} encryptedText - The encrypted text to decrypt.
 * @returns {string} - The decrypted text.
 */
const decryptText = (encryptedText) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
 const encodeEmail = (email) => {
    return Buffer.from(email).toString('base64');
  };
   const formatIsoDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`; 
  };


  const formatAmountObj =(obj)=> {
  const formatted = {};
  for (let key in obj) {
    formatted[key] = formatNumberStats(obj[key]);
  }
  return formatted;
}

const formatNumberStats = (num) =>{
  num = Number(num);
  if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(2) + " Cr";
  if (num >= 1_00_000) return (num / 1_00_000).toFixed(2) + " Lakh";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + " K";
  return num.toString();
}

module.exports = {
    encryptText,
    formatIsoDate,
    decryptText,
    encodeEmail,
    formatAmountObj,
    formatNumberStats
};
