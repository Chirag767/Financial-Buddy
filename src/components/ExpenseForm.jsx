import React, { useState } from "react";
import "../styles/forms.css"; // Import form styles

const ExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("one-time");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    onAdd({ title, amount: Number(amount), category, frequency });
    setTitle(""); setAmount(""); setCategory(""); setFrequency("one-time");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input 
          className="form-input" 
          placeholder="e.g. Grocery" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
      </div>

      <div className="form-row">
        <div className="half-width form-group">
          <label className="form-label">Amount</label>
          <input 
            className="form-input" type="number" placeholder="0.00"
            value={amount} onChange={e => setAmount(e.target.value)} 
          />
        </div>
        <div className="half-width form-group">
          <label className="form-label">Category</label>
          <input 
            className="form-input" placeholder="Food..."
            value={category} onChange={e => setCategory(e.target.value)} 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Frequency</label>
        <div className="freq-toggle">
          {["one-time", "monthly", "annual"].map(opt => (
            <button
              key={opt} type="button"
              className={`freq-btn ${frequency === opt ? 'active' : ''}`}
              onClick={() => setFrequency(opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button className="submit-btn" type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;