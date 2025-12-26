import React, { useMemo, useState } from "react";
import "../../styles/overview.css";

const ExecutiveView = ({ employees, invoices, expenses }) => {
  // 1. State for Tax Already Paid
  const [taxPaid, setTaxPaid] = useState(0);

  const stats = useMemo(() => {
    // Revenue (Paid Invoices)
    const revenue = invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + Number(i.amount), 0);

    // OpEx (Operational Expenses)
    const opex = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Monthly Payroll
    const monthlyPayroll = employees.reduce((sum, e) => sum + Number(e.salary), 0);
    
    // 2. UPDATED FORMULA: Annualized Payroll (Monthly * 12)
    const annualPayroll = monthlyPayroll * 12;

    // 3. UPDATED NET PROFIT: Revenue - Annual Payroll - OpEx
    const totalBurn = opex + annualPayroll;
    const netProfit = revenue - totalBurn;

    return { revenue, opex, payroll: annualPayroll, netProfit };
  }, [employees, invoices, expenses]);

  // Tax Calculation
  const estimatedTax = Math.max(0, stats.netProfit * 0.25);
  const remainingTax = Math.max(0, estimatedTax - taxPaid);

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Executive Summary</h2>
      
      <div className="ov-stats">
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Revenue (Paid)</span>
          <h3 className="ov-card__value ov-card__value--green">₹{stats.revenue.toLocaleString()}</h3>
        </div>
        
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Annual Payroll (Projected)</span>
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

      {/* Tax Estimation Box with "Already Paid" Input */}
      <div className="ov-card ov-card--main" style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
        
        {/* Left Side: Result */}
        <div>
            <h4 className="ov-card__title">👮 Tax Estimator (25%)</h4>
            <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '5px'}}>
                Total Liability: ₹{estimatedTax.toLocaleString()}
            </p>
            <h2 style={{color: '#fff', margin: '0'}}>
                Due: ₹{remainingTax.toLocaleString()}
            </h2>
        </div>

        {/* Right Side: Input */}
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px'}}>
            <label style={{color: '#ccc', fontSize: '0.85rem', display: 'block', marginBottom: '8px'}}>
                Less: Tax Already Paid
            </label>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span style={{color: '#fff'}}>₹</span>
                <input 
                    type="number" 
                    value={taxPaid} 
                    onChange={(e) => setTaxPaid(Number(e.target.value))}
                    style={{
                        background: 'transparent',
                        border: '1px solid #444',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '6px',
                        width: '120px',
                        fontSize: '1rem'
                    }}
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default ExecutiveView;