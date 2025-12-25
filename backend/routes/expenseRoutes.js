const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// GET Expenses
router.get("/", async (req, res) => {
  try {
    const { userEmail, userType } = req.query;
    if (!userEmail) return res.status(400).json({ error: "User email is required" });
    const expenses = await Expense.find({ userEmail, userType }).sort({ date: -1 }); // Sort by DATE, not createdAt
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST Expense 
router.post("/", async (req, res) => {
  try {
    // 1. Destructure 'date' from the body
    const { title, amount, category, frequency, date, userEmail, userType } = req.body;

    if (!title || !amount || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Parse the date
    const finalDate = date ? new Date(date) : new Date();

    const newExpense = new Expense({
      title,
      amount,
      category,
      frequency: frequency || "one-time",
      date: finalDate,
      userEmail,
      userType: userType || "individual",
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// DELETE Expense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;