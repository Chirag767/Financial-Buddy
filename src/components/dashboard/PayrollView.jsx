import React, { useState } from "react";
import { addEmployee, deleteEmployee } from "../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

const PayrollView = ({ employees, refreshData }) => {
  const [formData, setFormData] = useState({ name: "", position: "", salary: "" });
  const [deleteId, setDeleteId] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("email");
    try {
      await addEmployee({ ...formData, userEmail });
      setFormData({ name: "", position: "", salary: "" });
      refreshData();
      toast.success("Employee Added");
    } catch (e) { toast.error("Failed to add"); }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
        await deleteEmployee(deleteId);
        refreshData();
        toast.success("Employee removed");
    } catch(e) {
        toast.error("Failed to remove");
    }
    setDeleteId(null);
  };

  return (
    <div className="ov-view">
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Remove Employee?"
        message="Are you sure you want to remove this employee? This affects payroll records."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <h2 className="ov-view__title">Payroll Management</h2>
      
      {/* Add Form */}
      <div className="ov-card ov-card--main" style={{marginBottom: '20px'}}>
        <form onSubmit={handleAdd} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <input className="me-input" placeholder="Name" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required />
            <input className="me-input" placeholder="Position" value={formData.position} onChange={e=>setFormData({...formData, position:e.target.value})} required />
            <input className="me-input" type="number" placeholder="Salary (₹)" value={formData.salary} onChange={e=>setFormData({...formData, salary:e.target.value})} required />
            <button className="me-btn me-btn--cash">Add Staff</button>
        </form>
      </div>

      {/* List */}
      <div className="ov-list">
        {employees.map(emp => (
            <div key={emp._id} className="ov-item">
                <div className="ov-item__info">
                    <span className="ov-item__name">{emp.name}</span>
                    <span className="ov-item__tag">{emp.position}</span>
                </div>
                <div className="ov-item__amount ov-item__amount--red">
                    ₹{Number(emp.salary).toLocaleString()}
                    <button onClick={()=>handleDelete(emp._id)} style={{marginLeft:'15px', background:'none', border:'none', cursor:'pointer'}}>🗑️</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default PayrollView;