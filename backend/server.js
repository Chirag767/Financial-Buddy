require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const expenseRoutes = require("./routes/expenseRoutes");
const aiRoutes = require("./routes/aiRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const goalRoutes = require("./routes/goalRoutes");
const bankRoutes = require("./routes/bankRoutes")
const companyRoutes = require("./routes/companyRoutes");

// Import Models
const User = require("./models/users");

const app = express();


app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors());

app.use(express.json());

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* --- AUTH ROUTES--- */

// 1. Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { email, userType, companyName } = req.body;

    // 1. Basic Validation
    if (!email || !userType) {
      return res.status(400).json({ error: "Email and userType are required" });
    }

    // 2. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    // 3. Prepare User Data Object
    // We explicitly build the object to ensure no bad data gets passed
    const userData = {
      email,
      userType
    };

    // Only add companyName if the type is explicitly "company"
    if (userType === 'company') {
      if (!companyName) {
        return res.status(400).json({ error: "Company Name is required for company accounts." });
      }
      userData.companyName = companyName;
    }

    // 4. Create and Save
    const newUser = new User(userData);
    await newUser.save();

    console.log(`✅ Registered new ${userType}: ${email}`);
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// 2. Get User Info Route
app.get("/api/get-user-info", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    
    if (user) {
      // Send back the data found
      res.json({ 
        userType: user.userType,
        companyName: user.companyName 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* --- EXISTING ROUTES --- */
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/bank",bankRoutes);
app.use("/api/company", companyRoutes);

/* Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});