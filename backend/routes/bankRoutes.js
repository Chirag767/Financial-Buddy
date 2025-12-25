const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Helper to go back in time (for recurring start dates)
const getPastDate = (monthsAgo) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d;
};

// Helper to get random recent date (for one-time purchases)
const getRecentDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

router.post("/link-mock-bank", async (req, res) => {
  const { userEmail } = req.body;
  
  if (!userEmail) {
    return res.status(400).json({ error: "User email is required." });
  }

  // Mock Data
  const mockExpenses = [
    { 
      title: "Netflix Subscription", 
      amount: 499, 
      category: "Subscription", 
      frequency: "monthly", 
      date: getPastDate(6)
    },
    { 
      title: "Starbucks Coffee", 
      amount: 350, 
      category: "Food", 
      frequency: "one-time", 
      date: new Date()
    },
    { 
      title: "Amazon Electronics", 
      amount: 12000, 
      category: "Shopping", 
      frequency: "one-time", 
      date: getRecentDate(5)
    },
    { 
      title: "HDFC Home Loan", 
      amount: 25000, 
      category: "Subscription", 
      frequency: "monthly",
      date: getPastDate(10)
    },
    { 
      title: "Grocery Run", 
      amount: 1500, 
      category: "Food", 
      frequency: "one-time", 
      date: getRecentDate(2)
    }
  ];

  const mockIncomes = [
    { 
      source: "Tech Corp Salary", 
      amount: 85000, 
      frequency: "monthly", 
      date: getPastDate(12)
    },
    { 
      source: "Freelance Project", 
      amount: 15000, 
      frequency: "one-time", 
      date: getRecentDate(10)
    }
  ];

  try {
    // 1. Map Expenses
    const expensesToInsert = mockExpenses.map(e => ({
      ...e,
      userEmail,
      userType: "individual"
    }));

    // 2. Map Incomes
    const incomesToInsert = mockIncomes.map(i => ({
      ...i,
      userEmail,
      userType: "individual"
    }));

    // 3. Insert into DB
    if (expensesToInsert.length > 0) await Expense.insertMany(expensesToInsert);
    if (incomesToInsert.length > 0) await Income.insertMany(incomesToInsert);

    console.log(`✅ Bank Linked for ${userEmail} with realistic history.`);
    res.json({ message: "Mock Bank Linked & Data Seeded!" });

  } catch (err) {
    console.error("❌ Bank Sync Error:", err);
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

module.exports = router;