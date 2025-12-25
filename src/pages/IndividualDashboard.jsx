import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { getExpenses, getIncomes, getGoals } from "../services/api";
import toast, { Toaster } from "react-hot-toast";

import OverviewView from "../components/dashboard/OverviewView";
import ManualEntryView from "../components/dashboard/ManualEntryView";
import UpcomingBillsView from "../components/dashboard/UpcomingBillsView";
import AiBuddyView from "../components/dashboard/AiBuddyView";

import "../styles/individualdash.css";

const IndividualDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");
  const userType = localStorage.getItem("userType") || "individual";
  const [isBankLinked, setIsBankLinked] = useState(false);

  useEffect(() => {
    if (!email) navigate("/");
    fetchAllData();
  }, [email, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [expData, incData, goalData] = await Promise.all([
        getExpenses(email, userType),
        getIncomes(email),
        getGoals(email)
      ]);

      const validExpenses = expData || [];
      const validIncomes = incData || [];

      setExpenses(validExpenses);
      setIncomes(validIncomes);
      setGoals(goalData || []);

      const hasBankSignature = 
          validIncomes.some(inc => inc.source === "Tech Corp Salary")

      if (hasBankSignature) {
        setIsBankLinked(true);
        localStorage.setItem("isBankLinked", "true");
      } else {
        setIsBankLinked(false);
      }
      
    } catch (error) {
      console.error("Data Fetch Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkBank = async () => {
    const loadId = toast.loading("Connecting to Mock Bank...");
    try {
      const response = await fetch("http://localhost:5000/api/bank/link-mock-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success!
        localStorage.setItem("isBankLinked", "true");
        setIsBankLinked(true);
        await fetchAllData();
        toast.dismiss(loadId);
        toast.success("Bank Linked Successfully!");
      } else {
        toast.dismiss(loadId);
        toast.error(`Link Failed: ${data.error}`);
      }
    } catch (error) {
      toast.dismiss(loadId);
      toast.error("Network Error: Is backend running?");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#333', color: '#fff' },
        }}
      />

      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header className="main-header">
        <div className="header-left-group">
          <div className="brand-section">
            <h1>Financial Buddy 🤖</h1>
            <p>{email}</p>
          </div>
          <div className="status-area">
            {!isBankLinked && !loading && (
              <button className="link-bank-header-btn" onClick={handleLinkBank}>🏦 Link Bank Account</button>
            )}
            
            {isBankLinked && (
               <div className="bank-status-tag"><span className="dot"></span> Bank Linked</div>
            )}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <nav className="glass-nav">
        <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>📊 Overview</button>
        <button className={`nav-item ${activeTab === "entry" ? "active" : ""}`} onClick={() => setActiveTab("entry")}>✍️ Manual Entry</button>
        <button className={`nav-item ${activeTab === "bills" ? "active" : ""}`} onClick={() => setActiveTab("bills")}>📅 Future Bills</button>
        <button className={`nav-item ${activeTab === "ai" ? "active" : ""}`} onClick={() => setActiveTab("ai")}>🤖 AI Buddy</button>
      </nav>

      <main className="content-shell">
        {loading ? (
          <div className="loading-spinner">Analyzing Ledger...</div>
        ) : (
          <>
            <div style={{ display: activeTab === "overview" ? "block" : "none" }}>
              <OverviewView expenses={expenses} incomes={incomes} goals={goals} />
            </div>
            
            <div style={{ display: activeTab === "entry" ? "block" : "none" }}>
              <ManualEntryView expenses={expenses} incomes={incomes} refreshData={fetchAllData} />
            </div>

            <div style={{ display: activeTab === "bills" ? "block" : "none" }}>
              <UpcomingBillsView goals={goals} refreshData={fetchAllData} />
            </div>

            <div style={{ display: activeTab === "ai" ? "block" : "none" }}>
              <AiBuddyView expenses={expenses} incomes={incomes} goals={goals} userType={userType} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default IndividualDashboard;