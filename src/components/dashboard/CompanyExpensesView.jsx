import React, { useState } from "react";
import { addExpense, deleteExpense } from "../../services/api";
import toast from "react-hot-toast";

const CompanyExpensesView = ({ expenses, refreshData }) => {
  const [loading, setLoading] = useState(false);
  
  // Default date to today
  const getToday = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Rent/Office",
    date: getToday(),
    type: "OpEx" // OpEx (Operating Expense) vs CapEx (Asset)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem("email");

    try {
      // Reusing the standard addExpense API but passing userType='company'
      // We append the 'type' (OpEx/CapEx) to the title or category for simple tracking, 
      // or just rely on the category.
      await addExpense({
        ...formData,
        category: `${formData.category} (${formData.type})`, // Small hack to see type in list
        userEmail: email,
        userType: "company",
        frequency: "one-time"
      });

      setFormData({
        title: "",
        amount: "",
        category: "Rent/Office",
        date: getToday(),
        type: "OpEx"
      });
      
      refreshData();
      toast.success("Expense Recorded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this expense record?")) {
        await deleteExpense(id);
        refreshData();
        toast.success("Record Deleted");
    }
  };

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Operating Expenses & Assets</h2>
      <p style={{color: '#aaa', marginBottom:'15px'}}>Track daily bills (OpEx) and long-term purchases (Assets).</p>

      {/* --- ADD EXPENSE FORM --- */}
      <div className="ov-card ov-card--main" style={{marginBottom: '2rem'}}>
        <form onSubmit={handleSubmit} className="company-form-grid">
            
            <div className="form-group">
                <label>Description</label>
                <input 
                    className="me-input" 
                    placeholder="e.g., Office Rent, New Laptops" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                />
            </div>

            <div className="form-group">
                <label>Amount (₹)</label>
                <input 
                    className="me-input" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                    required 
                />
            </div>

            <div className="form-group">
                <label>Date</label>
                <input 
                    className="me-input" 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required 
                />
            </div>

            <div className="form-group">
                <label>Category</label>
                <select 
                    className="me-input" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                >
                    <option value="Rent/Office">Rent & Office</option>
                    <option value="Software">Software & Servers</option>
                    <option value="Marketing">Marketing/Ads</option>
                    <option value="Travel">Travel & Meals</option>
                    <option value="Legal">Legal & Admin</option>
                    <option value="Equipment">Equipment (Asset)</option>
                    <option value="Repairs">Repairs</option>
                </select>
            </div>

            <div className="form-group">
                <label>Type</label>
                <select 
                    className="me-input" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                >
                    <option value="OpEx">OpEx (Day-to-Day)</option>
                    <option value="CapEx">CapEx (Long-term Asset)</option>
                </select>
            </div>

            <div className="form-group" style={{display:'flex', alignItems:'flex-end'}}>
                <button className="me-btn me-btn--cash" disabled={loading} style={{width:'100%'}}>
                    {loading ? "Adding..." : "➕ Record Expense"}
                </button>
            </div>
        </form>
      </div>

      {/* --- EXPENSE LIST --- */}
      <h3 className="ov-section-title" style={{paddingLeft:'5px'}}>Recent Spending</h3>
      <div className="ov-list">
        {expenses.length === 0 ? <p className="ov-empty-text">No expenses recorded yet.</p> : (
            expenses.map((item) => (
                <div key={item._id} className="ov-item">
                    <div className="ov-item__info">
                        <div className="ov-item__header">
                            <span className="ov-item__name">{item.title}</span>
                            <span className="ov-item__tag">{item.category}</span>
                        </div>
                        <span className="ov-item__date">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="ov-item__amount ov-item__amount--red">
                        - ₹{Number(item.amount).toLocaleString()}
                        <button className="delete-icon-btn" onClick={() => handleDelete(item._id)}>✕</button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CompanyExpensesView;