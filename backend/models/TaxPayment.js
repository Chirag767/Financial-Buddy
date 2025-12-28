const mongoose = require("mongoose");

const TaxPaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TaxPayment", TaxPaymentSchema);