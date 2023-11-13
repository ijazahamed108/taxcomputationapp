const express = require('express');
const  router = express.Router();
require('dotenv').config();
const { verifyToken } = require('../middleware/jwtAuthMiddleware')
const TaxDetails = require('../models/TaxDetails');
const { calculateIncomeTax } = require('../helpers/taxComputationHelper')
const TaxAuditRecord = require('../models/TaxAuditRecord')

// Route to store tax details (protected)
router.post('/store', verifyToken, async (req, res) => {
  try {
    const {  financialYear, totalIncome, panNumber, hra, healthInsurance } = req.body;
    const { userId } = req.query;
    const deductions = ( parseInt(hra) + parseInt(healthInsurance) );
    const taxApplicableIncome = (parseInt(totalIncome) - deductions);
    const netTaxPayable = deductions > totalIncome ? 0 : await calculateIncomeTax({taxApplicableIncome})
    const isTaxPaid = await TaxAuditRecord.find({userId, financialYear });
    //if tax is already paid no need to create again 
    // if(isTaxPaid){
    //     res.status(200).json({ paid : true})
    //     return;
    // }
    const taxDetails = new TaxDetails({
      userId,
      financialYear,
      totalIncome,
      panNumber,
      hra,
      healthInsurance,
      netTaxPayable:parseFloat(netTaxPayable.toFixed(2))
    });

    const savedTaxDetails = await taxDetails.save();
    res.json({
        savedTaxDetails,
        totalTaxLiable,
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve tax details for a specific user 
router.get('/get', verifyToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const taxDetails = await TaxDetails.find({ userId }).sort({ submissionDate: -1 });

    res.json(taxDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/paytaxes', async (req, res) => {
    try {
      const { userId, upiId, amount, financialYear } = req.body;
  
      // Check if the user has already paid taxes for the given financial year
      const hasPaidTaxes = await TaxAuditRecord.exists({ userId, financialYear });
      if (hasPaidTaxes) {
        return res.status(201).json({ paid: true });
      }
  
      // Create a new TaxAuditRecord
      const newAuditRecord = new TaxAuditRecord({
        userId,
        upiId,
        amount,
        financialYear,
      });
  
      // Save the new audit record
      await newAuditRecord.save();
  
      res.status(201).json({ result: 'Taxes paid successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;

