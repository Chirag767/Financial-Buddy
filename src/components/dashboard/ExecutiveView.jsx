import React, { useMemo } from "react";
import "../../styles/overview.css";

const ExecutiveView = ({ employees, invoices, expenses }) => {
  const stats = useMemo(() => {
    // 1. Calculate Total Revenue
    const revenue = invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + Number(i.amount), 0);

    // 2. Calculate OpEx (Operational Expenses)
    const opex = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 3. Calculate Payroll (Sum of all salaries)
    const payroll = employees.reduce((sum, e) => sum + Number(e.salary), 0);

    // 4. Net Profit
    const totalBurn = opex + payroll;
    const netProfit = revenue - totalBurn;

    return { revenue, opex, payroll, netProfit };
  }, [employees, invoices, expenses]);

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Executive Summary</h2>
      
      <div className="ov-stats">
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Revenue (Paid)</span>
          <h3 className="ov-card__value ov-card__value--green">₹{stats.revenue.toLocaleString()}</h3>
        </div>
        
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Payroll Cost</span>
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

      {/* Tax Estimation Box */}
      <div className="ov-card ov-card--main" style={{marginTop: '20px'}}>
        <h4 className="ov-card__title">👮 Tax Estimator (Approx. 25%)</h4>
        <p style={{color: '#aaa', fontSize: '0.9rem'}}>Based on current Net Profit, you should set aside:</p>
        <h2 style={{color: '#fff', margin: '10px 0'}}>
            ₹{Math.max(0, stats.netProfit * 0.25).toLocaleString()}
        </h2>
      </div>
    </div>
  );
};

export default ExecutiveView;