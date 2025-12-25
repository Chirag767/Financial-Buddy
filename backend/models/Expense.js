const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    default: "one-time",
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
    enum: ["individual", "company"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);