import React, { useState } from "react";
import { addGoal, deleteGoal } from "../../services/api";
import "../../styles/upcoming-bills.css";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";

const UpcomingBillsView = ({ goals, refreshData }) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null)

  const calculateMonthlyNeed = (amount, dateStr) => {
    const target = new Date(dateStr);
    const now = new Date();
    let months = (target.getFullYear() - now.getFullYear()) * 12;
    months -= now.getMonth();
    months += target.getMonth();
    if (months <= 0) return amount;
    return (amount / months).toFixed(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      await addGoal({ ...formData, userEmail: email });
      setFormData({ title: "", targetAmount: "", targetDate: "", priority: "Medium" });
      refreshData();
    } catch (error) {
      console.error("Failed to add bill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setGoalToDelete(id);
  };
  const confirmDelete = async () => {
    if (!goalToDelete) return;
    try {
        await deleteGoal(goalToDelete);
        refreshData();
        toast.success("Goal removed");
    } catch(e) {
        toast.error("Failed to remove");
    }
    setGoalToDelete(null);
  };
  return (
    <div className="ub-view">
      <ConfirmModal 
        isOpen={!!goalToDelete}
        title="Remove Goal?"
        message="Are you sure you want to remove this Goal?"
        onConfirm={confirmDelete}
        onCancel={() => setGoalToDelete(null)}
      />

      <header className="ub-header">
        <h2 className="ub-header__title">Future Planning 🎯</h2>
        <p className="ub-header__subtitle">Track upcoming big expenses and save effectively.</p>
      </header>

      <div className="ub-grid">
        {/* --- FORM SECTION --- */}
        <div className="ub-card ub-card--form">
          <h3 className="ub-card__title">Add Future Bill/Occasion</h3>
          <form onSubmit={handleSubmit} className="ub-form">
            <input
              className="ub-input"
              type="text"
              placeholder="e.g., Annual Insurance, Paris Trip"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              className="ub-input"
              type="number"
              placeholder="Target Amount (₹)"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
            <div className="ub-input-group">
              <label>Target Date</label>
              <input
                className="ub-input"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
            <select
              className="ub-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="High">🔥 High Priority</option>
              <option value="Medium">⚠️ Medium Priority</option>
              <option value="Low">☕ Low Priority</option>
            </select>
            <button className="ub-btn" disabled={loading}>
              {loading ? "Saving..." : "🎯 Save Plan"}
            </button>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="ub-list-container">
          {goals.length === 0 ? (
            <div className="ub-empty">No upcoming bills planned yet.</div>
          ) : (
            <div className="ub-list-grid">
              {goals.map((goal) => {
                const monthlyNeed = calculateMonthlyNeed(goal.targetAmount, goal.targetDate);
                return (
                  <div key={goal._id} className={`ub-item-card ub-item-card--${goal.priority.toLowerCase()}`}>
                    <div className="ub-item-header">
                      <span className={`ub-badge ub-badge--${goal.priority.toLowerCase()}`}>
                        {goal.priority}
                      </span>
                      <button onClick={() => handleDelete(goal._id)} className="ub-delete-btn">✕</button>
                    </div>
                    <h4 className="ub-item-title">{goal.title}</h4>
                    <div className="ub-item-main">
                      <span className="ub-item-total">₹{Number(goal.targetAmount).toLocaleString()}</span>
                      <span className="ub-item-date">By {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    {/* <div className="ub-item-footer">
                      <p>Monthly Savings Needed:</p>
                      <span className="ub-item-monthly">₹{Number(monthlyNeed).toLocaleString()}/mo</span>
                    </div> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingBillsView;