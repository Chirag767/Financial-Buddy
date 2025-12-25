const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// GET Goals
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: "Email required" });

    const goals = await Goal.find({ userEmail }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST Goal
router.post("/", async (req, res) => {
  try {
    const { title, targetAmount, targetDate, priority, userEmail } = req.body;
    if (!title || !targetAmount || !userEmail) return res.status(400).json({ error: "Missing fields" });

    const newGoal = new Goal({
      title,
      targetAmount,
      targetDate,
      priority: priority || "Medium",
      userEmail
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: "Failed to save goal" });
  }
});

// DELETE Goal
router.delete("/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

module.exports = router;