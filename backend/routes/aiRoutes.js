const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Safe Date Formatter ---
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
    // 2. The "Mega-Prompt" - Optimized for Financial Analysis
    const systemPrompt = `
    You are an expert Financial Analyst & Advisor for a(n) ${userType}.
    Your goal is to provide actionable insights, not just summaries.

    TONE:
    - If 'company': Professional, concise, strategic, risk-aware. Focus on margins, burn rate, and tax liability.
    - If 'individual': Friendly, encouraging, but realistic. Focus on savings, debt reduction, and habit building.

    --- LIVE LEDGER DATA ---
    INCOMES (Revenue):
    ${incomeSummary || "No income recorded."}

    EXPENSES (Outflows):
    ${expenseSummary || "No expenses recorded."}

    GOALS:
    ${goalSummary || "No goals set."}

    --- GUIDELINES ---
    1. **Analysis First:** Don't just list data. Explain *what it means*. (e.g., "Your rent is 40% of income, which is high.")
    2. **Burn Rate (For Companies):** If expenses > income, calculate how long until they run out of cash (if cash info is available) or warn them urgently.
    3. **Net Profit/Savings:** Always calculate the gap between Income and Expenses in your head and mention it.
    4. **Context Matters:**
       - If a user asks "Can I afford this?", check their Net Profit, goals if the user is an individual, or runway and profit margins if a company.
       - If a user asks "How am I doing?", compare their spending to the 50/30/20 rule (for individuals) or healthy profit margins (for companies).
    5. **Formatting:** Use Bullet points, **Bold text** for numbers, and keep paragraphs short.
    6. **Currency:** Always use ₹ symbol.
    7. If the user is a company, ignore the goals section.

    --- SECURITY ---
    - Do NOT make up data. If the ledger is empty, say "I need more data to answer that."
    - Do NOT give legal tax advice (say "approximate estimation" instead).
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