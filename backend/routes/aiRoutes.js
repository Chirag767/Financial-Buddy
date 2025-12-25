const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER: Safe Date Formatter ---
const formatDate = (dateInput) => {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return "Unknown Date";
  }
};

router.post("/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const userType = context.userType || "individual";

    // 1. Better Data Formatting with Safe Dates
    const expenseData = context.expenses || [];
    const incomeData = context.incomes || [];
    const goalData = context.goals || [];
    
    const expenseSummary = expenseData.map((e, index) => {
      const safeDate = formatDate(e.date || e.createdAt);
      return `[TxID:${index + 1}] ${safeDate} | ${e.title} (${e.category}) | ₹${e.amount} | ${e.frequency}`;
    }).join("\n");

    const incomeSummary = incomeData.map((i, index) => 
       `[INCOME] ${formatDate(i.date || i.createdAt)} | ${i.source} | ₹${i.amount} (${i.frequency})`
    ).join("\n");

    const goalSummary = goalData.map((g, index) => 
       `[GOAL] ${g.title}: Target ₹${g.targetAmount} by ${formatDate(g.targetDate)} (Priority: ${g.priority})`
    ).join("\n");

    // 2. The "Mega-Prompt"
    const systemPrompt = `
    You are an AI Financial Assistant for a(n) ${userType}.
    
    TONE: ${userType === 'company' ? 'Professional, concise, corporate' : 'Friendly, encouraging, casual'}.
    
    USER DATA :
    --- INCOMES ---
    ${incomeSummary || "No income recorded."}
    
    --- EXPENSES ---
    ${expenseSummary || "No expenses recorded."}
    
    --- GOALS ---
    ${goalSummary || "No goals set."}

    RULES:
    - Answer based ONLY on the Data Ledger.
    - If asked for a total, explicitly list the items you are summing up.
    - Format monetary values with ₹.
    - Keep answers short and direct.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Optimized Chat Initialization
    // filter history to ensure valid text to prevent API errors
    const validHistory = history.filter(h => h.text && h.text.trim() !== "").map(h => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: `Understood. I have the ledger. Ready.` }]
        },
        ...validHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
});

module.exports = router;