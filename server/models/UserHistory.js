const mongoose = require('mongoose');

const userHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    updatedFields: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;
