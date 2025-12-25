const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userType: { 
    type: String, 
    required: true, 
    enum: ["individual", "company"],
    default: "individual"
  },
  companyName: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("User", UserSchema);