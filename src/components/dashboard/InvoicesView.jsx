import React, { useState } from "react";
import { addInvoice, updateInvoiceStatus } from "../../services/api";
import toast from "react-hot-toast";

const InvoicesView = ({ invoices, refreshData }) => {
  const [data, setData] = useState({ clientName: "", amount: "", status: "Pending" });

  const handleAdd = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("email");
    try {
      await addInvoice({ ...data, userEmail, dueDate: new Date() });
      setData({ clientName: "", amount: "", status: "Pending" });
      refreshData();
      toast.success("Invoice Created");
    } catch (e) { toast.error("Error creating invoice"); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Paid" : "Pending";
    await updateInvoiceStatus(id, newStatus);
    refreshData();
  };

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Client Invoices</h2>
      
      <div className="ov-card ov-card--main" style={{marginBottom: '20px'}}>
        <form onSubmit={handleAdd} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <input className="me-input" placeholder="Client Name" value={data.clientName} onChange={e=>setData({...data, clientName:e.target.value})} required />
            <input className="me-input" type="number" placeholder="Amount (₹)" value={data.amount} onChange={e=>setData({...data, amount:e.target.value})} required />
            <button className="me-btn me-btn--inc">Create Invoice</button>
        </form>
      </div>

      <div className="ov-list">
        {invoices.map(inv => (
            <div key={inv._id} className="ov-item">
                <div className="ov-item__info">
                    <span className="ov-item__name">{inv.clientName}</span>
                    <span className={`ov-item__tag ${inv.status === 'Paid' ? 'ov-title-green' : 'ov-title-purple'}`} style={{borderLeft:'none', paddingLeft:0}}>
                        {inv.status}
                    </span>
                </div>
                <div className="ov-item__amount ov-item__amount--green">
                    ₹{Number(inv.amount).toLocaleString()}
                    <button 
                        onClick={()=>toggleStatus(inv._id, inv.status)}
                        style={{marginLeft:'10px', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', border:'none'}}
                    >
                        {inv.status === "Pending" ? "✅ Mark Paid" : "↩️ Undo"}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default InvoicesView;