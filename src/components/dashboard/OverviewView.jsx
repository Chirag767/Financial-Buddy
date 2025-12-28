import React, { useMemo } from "react";
import CategoryPieChart from "../CategoryPieChart";
import "../../styles/overview.css"; 

const OverviewView = ({ expenses, incomes, goals }) => {

  const { 
    totalIncome, 
    totalExpense, 
    balance, 
    savingsRate, 
    recentActivity, 
    activeSubscriptions,
    activeIncomes 
  } = useMemo(() => {
    const currentDate = new Date();

    // --- Calculate Multiplier based on time passed ---
    const getMultiplier = (frequency, dateStr) => {
      const startDate = new Date(dateStr);
      if (frequency === "monthly") {
        const monthsPassed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                             (currentDate.getMonth() - startDate.getMonth());
        return Math.max(1, monthsPassed + 1); // +1 to include current month
      }
      if (frequency === "yearly") {
        const yearsPassed = currentDate.getFullYear() - startDate.getFullYear();
        return Math.max(1, yearsPassed + 1);
      }
      return 1; // One-time
    };

    // --- 1. PROCESS INCOMES ---
    let incTotal = 0;
    const processedIncomes = incomes.map(inc => {
      const multiplier = getMultiplier(inc.frequency, inc.date || inc.createdAt);
      const totalEarned = Number(inc.amount) * multiplier;
      
      incTotal += totalEarned;

      return { ...inc, multiplier, totalEarned };
    });

    // Filter for the "Active Streams" UI (Exclude one-time)
    const activeIncStreams = processedIncomes.filter(i => i.frequency === 'monthly' || i.frequency === 'yearly');


    // --- 2. PROCESS EXPENSES (Subscriptions) ---
    // Separate Subscriptions from regular One-time expenses
    const subscriptions = expenses.filter(e => e.category === "Subscription");
    const regularExpenses = expenses.filter(e => e.category !== "Subscription");

    let expTotal = regularExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const processedSubs = subscriptions.map(sub => {
      const multiplier = getMultiplier(sub.frequency, sub.date || sub.createdAt);
      const totalCost = Number(sub.amount) * multiplier;
      
      expTotal += totalCost;

      return { ...sub, multiplier, totalPaid: totalCost };
    });

    // --- 3. FINAL BALANCES ---
    const bal = incTotal - expTotal;
    const rate = incTotal > 0 ? ((bal / incTotal) * 100).toFixed(1) : 0;

    // --- 4. RECENT ACTIVITY LIST ---
    const normalizedInc = incomes.map(i => ({ ...i, type: 'income', date: i.date || i.createdAt }));
    const normalizedExp = expenses.map(e => ({ ...e, type: 'expense', date: e.date || e.createdAt }));
    
    const allActivity = [...normalizedInc, ...normalizedExp].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    return { 
      totalIncome: incTotal, 
      totalExpense: expTotal, 
      balance: bal, 
      savingsRate: rate, 
      recentActivity: allActivity,
      activeSubscriptions: processedSubs,
      activeIncomes: activeIncStreams
    };
  }, [expenses, incomes]);

  return (
    <div className="ov-view">
      <h2 className="ov-view__title">Financial Overview</h2>

      {/* --- STATS GRID --- */}
      <div className="ov-stats">
        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Total Income (Acc.)</span>
          <h3 className="ov-card__value ov-card__value--green">₹{totalIncome.toLocaleString()}</h3>
        </div>

        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Total Spent (Acc.)</span>
          <h3 className="ov-card__value ov-card__value--red">₹{totalExpense.toLocaleString()}</h3>
        </div>

        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Net Balance</span>
          <h3 className={`ov-card__value ${balance >= 0 ? 'ov-card__value--white' : 'ov-card__value--red'}`}>
            ₹{balance.toLocaleString()}
          </h3>
        </div>

        <div className="ov-card ov-card--stat">
          <span className="ov-card__label">Savings Rate</span>
          <h3 className="ov-card__value ov-card__value--blue">{savingsRate}%</h3>
        </div>
      </div>

      {/* --- MAIN CONTENT SPLIT --- */}
      <div className="ov-content">
        <div className="ov-card ov-card--main">
          <h4 className="ov-card__title">Spending Distribution</h4>
          <div className="ov-chart">
            {expenses.length > 0 ? <CategoryPieChart expenses={expenses} /> : <div className="ov-empty">No Data</div>}
          </div>
        </div>

        <div className="ov-card ov-card--main">
          <h4 className="ov-card__title">Recent Activity</h4>
          <div className="ov-list">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="ov-item">
                <div className="ov-item__info">
                  <span className="ov-item__name">{item.title || item.source}   </span>
                  <span className="ov-item__date">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className={`ov-item__amount ${item.type === 'income' ? 'ov-item__amount--green' : 'ov-item__amount--red'}`}>
                  {item.type === 'income' ? '+' : '-'} ₹{item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW: RECURRING SECTIONS GRID --- */}
      <div className="ov-recurring-grid">
        
        {/* 1. Active Income Streams */}
        <div className="ov-section-col">
          <h3 className="ov-section-title ov-title-green">🤑 Active Income Streams</h3>
          <div className="ov-cards-list">
            {activeIncomes.length === 0 ? <p className="ov-empty-text">No recurring income.</p> : (
              activeIncomes.map((inc, i) => (
                <div key={i} className="ov-sub-card ov-card-green-border">
                  <div className="ov-sub-header">
                    <div className="ov-sub-icon icon-green">💰</div>
                    <div>
                      <h4>{inc.source}</h4>
                      <span className="ov-sub-freq">{inc.frequency}</span>
                    </div>
                  </div>
                  <div className="ov-sub-details">
                     <div className="ov-sub-row"><span>Per Month:</span> <strong>₹{inc.amount}</strong></div>
                     <div className="ov-sub-row"><span>Earned so far:</span> <strong>₹{inc.totalEarned} ({inc.multiplier}x)</strong></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Active Subscriptions */}
        <div className="ov-section-col">
          <h3 className="ov-section-title ov-title-purple">🔄 Active Subscriptions</h3>
          <div className="ov-cards-list">
            {activeSubscriptions.length === 0 ? <p className="ov-empty-text">No active subscriptions.</p> : (
              activeSubscriptions.map((sub, i) => (
                <div key={i} className="ov-sub-card ov-card-purple-border">
                  <div className="ov-sub-header">
                    <div className="ov-sub-icon icon-purple">🍿</div>
                    <div>
                      <h4>{sub.title}</h4>
                      <span className="ov-sub-freq">{sub.frequency}</span>
                    </div>
                  </div>
                  <div className="ov-sub-details">
                     <div className="ov-sub-row"><span>Cost:</span> <strong>₹{sub.amount}</strong></div>
                     <div className="ov-sub-row"><span>Paid so far:</span> <strong>₹{sub.totalPaid} ({sub.multiplier}x)</strong></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewView;