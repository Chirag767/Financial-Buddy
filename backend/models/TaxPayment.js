const mongoose = require("mongoose");

const TaxPaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }, // e.g., "Q1 TDS"
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TaxPayment", TaxPaymentSchema);