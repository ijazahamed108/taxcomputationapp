const calculateIncomeTax = async ({taxApplicableIncome}) => {
    const taxBrackets = [
      { range: [0, 300000], taxRate: 0 },
      { range: [300001, 600000], taxRate: 0.05 },
      { range: [600001, 900000], taxRate: 0.10 },
      { range: [900001, 1200000], taxRate: 0.15 },
      { range: [1200001, 1500000], taxRate: 0.20 },
      { range: [1500001, Infinity], taxRate: 0.30 },
    ];
  
    let tax = 0;
    for (const bracket of taxBrackets) {
      if (taxApplicableIncome >= bracket.range[0] && taxApplicableIncome <= bracket.range[1]) {
        tax += (taxApplicableIncome - bracket.range[0]) * bracket.taxRate;
        break;
      }
    }
  
    return tax;
  };
  

module.exports = {
    calculateIncomeTax
}