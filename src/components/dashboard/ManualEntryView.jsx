import React, { useState } from "react";
import { addExpense, addIncome } from "../../services/api";
import "../../styles/manual-entry.css";
import toast from "react-hot-toast";

const ManualEntryView = ({ refreshData }) => {
  const [loading, setLoading] = useState(false);

  const getToday = () => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
  };

  // 1. CASH STATE
  const [cashData, setCashData] = useState({ 
    title: "", 
    amount: "", 
    category: "General", 
    date: getToday() 
  });

  // 2. SUBSCRIPTION STATE
  const [subData, setSubData] = useState({ 
    title: "", 
    amount: "", 
    category: "Subscription", 
    frequency: "monthly",
    date: getToday()
  });

  // 3. INCOME STATE
  const [incData, setIncData] = useState({ 
    source: "", 
    amount: "", 
    frequency: "monthly",
    date: getToday()
  });

  const handleAction = async (type, data, resetFn) => {
    setLoading(true);
    const loadingToast = toast.loading("Processing...");
    try {
      const email = localStorage.getItem("email");
      
      const payload = { ...data, userEmail: email };
      
      if (type === "income") {
        await addIncome(payload);
      } else {
        await addExpense({ ...payload, userType: "individual" });
      }
      
      resetFn();
      refreshData();

      toast.dismiss(loadingToast);
      toast.success(`${type === 'cash' ? 'Expense' : 'Entry'} added successfully!`, {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#1e1e1e',
          color: '#fff',
        },
      });

    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("Failed to add entry. Check connection.", {
        style: {
          borderRadius: '10px',
          background: '#ff4d4d',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="me-container">
      <header className="me-header">
        <h2 className="me-header__title">Manual Data Entry</h2>
        <p className="me-header__subtitle">Record transactions and setup recurring payments.</p>
      </header>

      <div className="me-grid">
        {/* --- PART 1: CASH PAYMENTS --- */}
        <div className="me-card me-card--cash">
          <div className="me-card__icon">💸</div>
          <h3 className="me-card__title">Cash Spendings</h3>
          <p className="me-card__desc">One-time spending.</p>
          <form className="me-form" onSubmit={(e) => { 
            e.preventDefault(); 
            handleAction("cash", cashData, () => setCashData({ ...cashData, title: "", amount: "", date: getToday() })); 
          }}>
            <input className="me-input" type="text" placeholder="Item Name" value={cashData.title} onChange={(e) => setCashData({ ...cashData, title: e.target.value })} required />
            <input className="me-input" type="number" placeholder="Amount (₹)" value={cashData.amount} onChange={(e) => setCashData({ ...cashData, amount: e.target.value })} required />
            
            <label className="me-label">Date</label>
            <input className="me-input" type="date" value={cashData.date} onChange={(e) => setCashData({ ...cashData, date: e.target.value })} required />

            <select className="me-input" value={cashData.category} onChange={(e) => setCashData({ ...cashData, category: e.target.value })}>
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
            </select>
            <button className="me-btn me-btn--cash" disabled={loading}>Record Expense</button>
          </form>
        </div>

        {/* --- PART 2: SUBSCRIPTIONS --- */}
        <div className="me-card me-card--sub">
          <div className="me-card__icon">🔁</div>
          <h3 className="me-card__title">Subscription</h3>
          <p className="me-card__desc">Recurring services.</p>
          <form className="me-form" onSubmit={(e) => { 
            e.preventDefault(); 
            handleAction("subscription", subData, () => setSubData({ ...subData, title: "", amount: "", date: getToday() })); 
          }}>
            <input className="me-input" type="text" placeholder="Service (e.g. Netflix)" value={subData.title} onChange={(e) => setSubData({ ...subData, title: e.target.value })} required />
            <input className="me-input" type="number" placeholder="Amount (₹)" value={subData.amount} onChange={(e) => setSubData({ ...subData, amount: e.target.value })} required />
            
            <label className="me-label">Start Date</label>
            <input className="me-input" type="date" value={subData.date} onChange={(e) => setSubData({ ...subData, date: e.target.value })} required />

            <select className="me-input" value={subData.frequency} onChange={(e) => setSubData({ ...subData, frequency: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="me-btn me-btn--sub" disabled={loading}>Add Subscription</button>
          </form>
        </div>

        {/* --- PART 3: INCOME --- */}
        <div className="me-card me-card--inc">
          <div className="me-card__icon">🏦</div>
          <h3 className="me-card__title">Income Stream</h3>
          <p className="me-card__desc">Salary or Freelance.</p>
          <form className="me-form" onSubmit={(e) => { 
            e.preventDefault(); 
            handleAction("income", incData, () => setIncData({ ...incData, source: "", amount: "", date: getToday() })); 
          }}>
            <input className="me-input" type="text" placeholder="Source" value={incData.source} onChange={(e) => setIncData({ ...incData, source: e.target.value })} required />
            <input className="me-input" type="number" placeholder="Amount (₹)" value={incData.amount} onChange={(e) => setIncData({ ...incData, amount: e.target.value })} required />
            
            <label className="me-label">Start Date</label>
            <input className="me-input" type="date" value={incData.date} onChange={(e) => setIncData({ ...incData, date: e.target.value })} required />

            <select className="me-input" value={incData.frequency} onChange={(e) => setIncData({ ...incData, frequency: e.target.value })}>
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="me-btn me-btn--inc" disabled={loading}>Add Income</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryView;