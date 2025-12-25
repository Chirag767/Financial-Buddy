const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// GET Incomes
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: "Email required" });
    const incomes = await Income.find({ userEmail }).sort({ date: -1 }); // Sort by DATE
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incomes" });
  }
});

// POST Income
router.post("/", async (req, res) => {
  try {
    const { source, amount, frequency, date, userEmail } = req.body;
    if (!source || !amount || !userEmail) return res.status(400).json({ error: "Missing fields" });

    const finalDate = date ? new Date(date) : new Date();

    const newIncome = new Income({
      source,
      amount,
      frequency: frequency || "one-time",
      date: finalDate,
      userEmail
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ error: "Failed to save income" });
  }
});

// DELETE Income
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete income" });
  }
});

module.exports = router;