const Counter = require('../model/policyCounter')

exports.getNextPolicyId = async () => {
    const counter = await Counter.findOneAndUpdate(
      { name: "policyId" }, 
      { $inc: { count: 1 } }, 
      { new: true, upsert: true }
    );
    return counter.count;
  };


  // exports.formatNumber = (num) => {
  //   if (num >= 1_000_000_000) {
  //     return (num / 1_000_000_000).toFixed(1) + "B"; // Convert to Billion
  //   } else if (num >= 1_000_000) {
  //     return (num / 1_000_000).toFixed(1) + "M"; // Convert to Million
  //   } else if (num >= 1_000) {
  //     return (num / 1_000).toFixed(1) + "K"; // Convert to Thousand
  //   }
  //   return num.toString(); 
  // };
  

  exports.formatNumber = (num) => {
  if (num >= 1_00_00_000) { // 1 Crore = 10,000,000
    return (num / 1_00_00_000).toFixed(1) + " Cr"; 
  } else if (num >= 1_00_000) { // 1 Lakh = 100,000
    return (num / 1_00_000).toFixed(1) + " L";
  } else if (num >= 1_000) { // 1 Thousand = 1,000
    return (num / 1_000).toFixed(1) + " K";
  }
  return num.toString();
};
