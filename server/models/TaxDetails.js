const mongoose = require('mongoose');

const taxDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  totalIncome: {
    type: Number,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  hra: {
    type: Number,
    required: true,
  },
  healthInsurance: {
    type: Number,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  netTaxPayable: {
    type: Number,
  },

});

const TaxDetails = mongoose.model('TaxDetails', taxDetailsSchema);

module.exports = TaxDetails;
