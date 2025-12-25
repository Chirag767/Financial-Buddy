const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  userEmail: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Goal", GoalSchema);