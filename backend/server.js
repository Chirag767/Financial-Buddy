require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// --- 1. FORCE HEADERS ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// --- 2. Middleware ---
app.use(express.json());

// --- 4. Database Connection  ---
if (!process.env.MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is missing in Environment Variables!");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));


/* Auth Routes */
app.post("/api/register", async (req, res) => {
  try {
    const { email, userType, companyName } = req.body;
    if (!email) return res.status(400).json({ error: "Email missing" });
    
    let user = await User.findOne({ email });
    if (user) return res.status(200).json({ message: "User exists" });

    const newUser = new User({ email, userType, companyName });
    await newUser.save();
    res.status(201).json({ message: "Registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/get-user-info", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});