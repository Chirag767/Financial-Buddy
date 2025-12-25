import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { getExpenses, getEmployees, getInvoices } from "../services/api";
import toast, { Toaster } from "react-hot-toast";

// View Components
import ExecutiveView from "../components/dashboard/ExecutiveView";
import PayrollView from "../components/dashboard/PayrollView";
import CompanyExpensesView from "../components/dashboard/CompanyExpensesView";
import InvoicesView from "../components/dashboard/InvoicesView";
import AiBuddyView from "../components/dashboard/AiBuddyView"

// CSS
import "../styles/individualdash.css";
import "../styles/company.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("executive");
  const [loading, setLoading] = useState(true);

  // Data States
  const [employees, setEmployees] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const email = localStorage.getItem("email");
  const companyName = localStorage.getItem("companyName") || "My Company";

  useEffect(() => {
    if (!email) navigate("/");
    fetchCompanyData();
  }, [email, navigate]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const [empData, invData, expData] = await Promise.all([
        getEmployees(email),
        getInvoices(email),
        getExpenses(email, "company")
      ]);
      
      setEmployees(empData || []);
      setInvoices(invData || []);
      setExpenses(expData || []);
    } catch (error) {
      console.error("Company Data Error:", error);
      toast.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // --- DATA MAPPING FOR AI ---
  // The AI expects "Incomes" and "Goals". We map Company data to fit that structure.
  const aiContext = useMemo(() => {
    // 1. Map Invoices -> Incomes
    const mappedIncomes = invoices.map(inv => ({
      source: inv.clientName,
      amount: inv.amount,
      frequency: inv.status, // "Paid" or "Pending" helps AI understand context
      date: inv.dueDate
    }));

    // 2. Map Employees -> Expenses
    const payrollExpenses = employees.map(emp => ({
      title: `Salary: ${emp.name}`,
      amount: emp.salary,
      category: "Payroll",
      frequency: "Monthly",
      date: new Date()
    }));

    // Combine standard expenses + payroll for the AI
    const allExpenses = [...expenses, ...payrollExpenses];

    return { incomes: mappedIncomes, expenses: allExpenses };
  }, [invoices, employees, expenses]);

  return (
    <div className="dashboard-container company-theme">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      <header className="main-header">
        <div className="header-left-group">
          <div className="brand-section">
            <h1>{companyName} 🏢</h1>
            <p>Corporate Finance Dashboard</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <nav className="glass-nav">
        <button className={`nav-item ${activeTab === "executive" ? "active" : ""}`} onClick={() => setActiveTab("executive")}>📊 Executive</button>
        <button className={`nav-item ${activeTab === "payroll" ? "active" : ""}`} onClick={() => setActiveTab("payroll")}>👥 Payroll</button>
        <button className={`nav-item ${activeTab === "expenses" ? "active" : ""}`} onClick={() => setActiveTab("expenses")}>💼 OpEx</button>
        <button className={`nav-item ${activeTab === "invoices" ? "active" : ""}`} onClick={() => setActiveTab("invoices")}>🧾 Invoices</button>
        <button className={`nav-item ${activeTab === "ai" ? "active" : ""}`} onClick={() => setActiveTab("ai")}>🤖 AI Advisor</button>
      </nav>

      <main className="content-shell">
        {loading ? (
          <div className="loading-spinner">Auditing Ledger...</div>
        ) : (
          <>
            <div style={{ display: activeTab === "executive" ? "block" : "none" }}>
              <ExecutiveView employees={employees} invoices={invoices} expenses={expenses} />
            </div>
            
            <div style={{ display: activeTab === "payroll" ? "block" : "none" }}>
              <PayrollView employees={employees} refreshData={fetchCompanyData} />
            </div>

            <div style={{ display: activeTab === "expenses" ? "block" : "none" }}>
              <CompanyExpensesView expenses={expenses} refreshData={fetchCompanyData} />
            </div>

            <div style={{ display: activeTab === "invoices" ? "block" : "none" }}>
              <InvoicesView invoices={invoices} refreshData={fetchCompanyData} />
            </div>

            <div style={{ display: activeTab === "ai" ? "block" : "none" }}>
              <AiBuddyView 
                expenses={aiContext.expenses} 
                incomes={aiContext.incomes} 
                goals={[]} // Companies don't have "Goals" yet, passing empty
                userType="company"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;