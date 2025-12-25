const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Paid"], 
    default: "Pending" 
  },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);