import React, { useMemo, useState, useEffect } from "react";
import { getTaxPayments, addTaxPayment } from "../../services/api";
import toast from "react-hot-toast";
import "../../styles/overview.css";

const ExecutiveView = ({ employees, invoices, expenses }) => {
  const email = localStorage.getItem("email");
  
  // Tax State
  const [taxHistory, setTaxHistory] = useState([]);
  const [newTax, setNewTax] = useState({ amount: "", date: "", notes: "" });
  const [loadingTax, setLoadingTax] = useState(false);

  // Fetch Tax History on Load
  useEffect(() => {
    fetchTaxes();
  }, [email]);

  const fetchTaxes = async () => {
    try {
        const data = await getTaxPayments(email);
        setTaxHistory(data || []);
    } catch (error) {
        console.error("Tax fetch failed", error);
    }
  };

  const handlePayTax = async (e) => {
    e.preventDefault();
    if(!newTax.amount) return;
    setLoadingTax(true);
    try {
        await addTaxPayment({ ...newTax, userEmail: email });
        toast.success("Tax payment recorded");
        setNewTax({ amount: "", date: "", notes: "" });
        fetchTaxes();
    } catch (error) {
        toast.error("Failed to record");
    } finally {
        setLoadingTax(false);
    }
  };

  const stats = useMemo(() => {
    const revenue = invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const opex = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const payroll = employees.reduce((sum, e) => sum + Number(e.salary), 0) * 12;

    const netProfit = revenue - payroll - opex;

    return { revenue, opex, payroll, netProfit };
  }, [employees, invoices, expenses]);

  // Tax Calculations
  const estimatedTotalTax = Math.max(0, stats.netProfit * 0.25);
  // Sum up all payments from database
  const totalTaxPaid = taxHistory.reduce((sum, t) => sum + Number(t.amount), 0);
  const remainingDue = Math.max(0, estimatedTotalTax - totalTaxPaid);

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Executive Summary</h2>
      
      {/* --- STATS CARDS --- */}
      <div className="ov-stats">
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Revenue (Paid)</span>
          <h3 className="ov-card__value ov-card__value--green">₹{stats.revenue.toLocaleString()}</h3>
        </div>
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Annual Payroll</span>
          <h3 className="ov-card__value ov-card__value--blue">₹{stats.payroll.toLocaleString()}</h3>
        </div>
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">OpEx</span>
          <h3 className="ov-card__value ov-card__value--red">₹{stats.opex.toLocaleString()}</h3>
        </div>
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Net Profit</span>
          <h3 className={`ov-card__value ${stats.netProfit >= 0 ? 'ov-card__value--white' : 'ov-card__value--red'}`}>
            ₹{stats.netProfit.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* --- TAX SECTION --- */}
      <div className="tax-section-container" style={{display:'grid', gap:'20px', marginTop:'20px'}}>
          
          {/* LEFT: Tax Summary & Payment Form */}
          <div className="ov-card ov-card--main">
             <h4 className="ov-card__title">👮 Tax Liability (25%)</h4>
             
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', paddingBottom:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                 <div>
                    <div style={{color:'#aaa', fontSize:'0.9rem'}}>Total Liability</div>
                    <div style={{fontSize:'1.2rem', fontWeight:'bold'}}>₹{estimatedTotalTax.toLocaleString()}</div>
                 </div>
                 <div>
                    <div style={{color:'#aaa', fontSize:'0.9rem'}}>Already Paid</div>
                    <div style={{fontSize:'1.2rem', color:'#10b981'}}>₹{totalTaxPaid.toLocaleString()}</div>
                 </div>
                 <div>
                    <div style={{color:'#aaa', fontSize:'0.9rem'}}>Net Due</div>
                    <div style={{fontSize:'1.4rem', color:'#f87171', fontWeight:'bold'}}>₹{remainingDue.toLocaleString()}</div>
                 </div>
             </div>

             <form onSubmit={handlePayTax} style={{display:'flex', gap:'10px', alignItems:'flex-end'}}>
                <div style={{flex:1}}>
                    <label style={{fontSize:'0.8rem', color:'#aaa'}}>Record Tax Paid</label>
                    <input 
                        className="me-input" 
                        type="number" 
                        placeholder="Amount" 
                        value={newTax.amount} 
                        onChange={e=>setNewTax({...newTax, amount:e.target.value})} 
                        required 
                    />
                </div>
                <div style={{flex:1}}>
                     <label style={{fontSize:'0.8rem', color:'#aaa'}}>Date </label>
                     <input 
                        className="me-input" 
                        type="date" 
                        value={newTax.date} 
                        onChange={e=>setNewTax({...newTax, date:e.target.value})} 
                     />
                </div>
                <button disabled={loadingTax} className="me-btn me-btn--cash" style={{height:'42px'}}>
                    {loadingTax ? "..." : "Pay"}
                </button>
             </form>
          </div>

          {/* RIGHT: Tax History List */}
          <div className="ov-card ov-card--main" style={{maxHeight:'300px', overflowY:'auto'}}>
              <h4 className="ov-card__title">📜 Payment History</h4>
              
              {taxHistory.length === 0 ? (
                  <p className="ov-empty">No tax payments recorded.</p>
              ) : (
                  <div className="ov-list">
                    {taxHistory.map(tax => (
                        <div key={tax._id} className="ov-item">
                            <div className="ov-item__info">
                                <span className="ov-item__name">Tax Payment</span>
                                <span className="ov-item__date">{new Date(tax.date).toLocaleDateString()}</span>
                            </div>
                            <div className="ov-item__amount ov-item__amount--green">
                                - ₹ {Number(tax.amount).toLocaleString()}
                            </div>
                        </div>
                    ))}
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default ExecutiveView;