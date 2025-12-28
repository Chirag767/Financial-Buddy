const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Invoice = require("../models/Invoice");
const TaxPayment = require("../models/TaxPayment");

// --- EMPLOYEE ENDPOINTS ---

router.get("/employees", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: "Company email required" });
    const employees = await Employee.find({ userEmail }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.post("/employees", async (req, res) => {
  try {
    const { name, position, salary, startDate, userEmail } = req.body;
    
    if (!name || !salary || !userEmail || !startDate) return res.status(400).json({ error: "Missing fields" });

    const newEmp = new Employee({ 
        name, 
        position, 
        salary, 
        startDate,
        userEmail 
    });
    
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

router.delete("/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove employee" });
  }
});

// --- INVOICE ENDPOINTS ---

router.get("/invoices", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: "Company email required" });
    const invoices = await Invoice.find({ userEmail }).sort({ dueDate: 1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

router.post("/invoices", async (req, res) => {
  try {
    const { clientName, amount, dueDate, status, userEmail } = req.body;
    if (!clientName || !amount || !userEmail) return res.status(400).json({ error: "Missing fields" });

    const newInv = new Invoice({ 
        clientName, 
        amount, 
        dueDate: dueDate || new Date(), 
        status: status || "Pending",
        userEmail 
    });
    await newInv.save();
    res.status(201).json(newInv);
  } catch (err) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

router.patch("/invoices/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});


// -- TAX PAYMENTS ENDPOINTS ---

router.get("/taxes", async (req, res) => {
    try {
        const { userEmail } = req.query;
        if (!userEmail) return res.status(400).json({ error: "Email required" });
        const taxes = await TaxPayment.find({ userEmail }).sort({ date: -1 });
        res.json(taxes);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch tax history" });
    }
});

router.post("/taxes", async (req, res) => {
    try {
        const { amount, date, notes, userEmail } = req.body;
        if (!amount || !userEmail || !date) return res.status(400).json({ error: "All fields required" });

        const newTax = new TaxPayment({
            amount,
            date,
            notes,
            userEmail
        });
        await newTax.save();
        res.status(201).json(newTax);
    } catch (e) {
        res.status(500).json({ error: "Failed to record tax" });
    }
});

module.exports = router;