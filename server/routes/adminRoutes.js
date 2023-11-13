const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const userHistory = require('../models/UserHistory')
const { verifyToken } = require('../middleware/jwtAuthMiddleware')
const TaxAuditRecord = require('../models/TaxAuditRecord')
const AuditRecordHistory = require('../models/AuditRecordHistory')

// Fetch all users
router.get('/users',verifyToken, async (req, res) => {
  try {
    const users = await User.find({}); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/get-audit-records',verifyToken, async (req, res) => {
    try {
      const taxAuditRecords = await TaxAuditRecord.find({}); 
      res.json(taxAuditRecords);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Update user details
router.put('/update-user/:userId',verifyToken, async (req, res) => {
  const { userId } = req.params;
  const updatedFields = req.body;

  try {
    const loggedUser = await User.findOne({userId});
    if (loggedUser.role === 'taxaccountant') {
        return res.status(403).json({ msg: 'Tax accountants are not allowed to edit user details.' });
      }
    // Find user by userId and update specified fields
    const user = await User.findOneAndUpdate({ userId }, { $set: updatedFields }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await logUserHistory(userId, updatedFields);

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user-history/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userHistory = await UserHistory.find({ userId });
      res.json(userHistory);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


async function logUserHistory(userId, updatedFields) {
        await userHistory.create({
            userId,
            updatedFields
        })
}

router.put('/update-tax-audit-record/:id', verifyToken, async (req, res) => {
    try {
      const { userId, financialYear, upiId, amount } = req.body;
  
      // Check if the user making the request is an admin
      const user = await User.findOne({userId});
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
  
      // Find the tax audit record by ID
      let taxAuditRecord = await TaxAuditRecord.findById(req.params.id);
  
      if (!taxAuditRecord) {
        return res.status(404).json({ msg: 'Tax audit record not found' });
      }
  
      // Update tax audit record
      taxAuditRecord.userId = userId;
      taxAuditRecord.financialYear = financialYear;
      taxAuditRecord.upiId = upiId;
      taxAuditRecord.netTaxPayable = amount;
  
      // Save the updated record
      await taxAuditRecord.save();
  
      // Log the change
      const changeLog = new AuditRecordHistory({
        auditRecordId: taxAuditRecord._id,
        userId: req.user.id,
        changes: {
          userId: userId,
          financialYear: financialYear,
          upiId: upiId,
          netTaxPayable: amount,
        },
      });
      await changeLog.save();
  
      res.json({ msg: 'Tax audit record updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  router.get('/audit-record-change-logs/:id', verifyToken, async (req, res) => {
    try {
      // Check if the user making the request is an admin
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
  
      // Find the audit record change logs by audit record ID
      const changeLogs = await AuditRecordHistory.find({ auditRecordId: req.params.id });
  
      res.json(changeLogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

module.exports = router;
