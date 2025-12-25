const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["one-time", "monthly", "yearly"],
    default: "monthly",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "individual",
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Income", IncomeSchema);