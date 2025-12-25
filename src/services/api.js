import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || `${window.location.origin}/api`;

/* --- EXPENSES --- */

export const getExpenses = async (email, userType) => {
  if (!email) return [];
  const res = await axios.get(`${API_URL}/expenses`, {
    params: { userEmail: email, userType: userType || "individual" },
  });
  return res.data;
};

export const addExpense = async (expenseData) => {
  const res = await axios.post(`${API_URL}/expenses`, expenseData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API_URL}/expenses/${id}`);
  return res.data;
};

/* --- INCOMES --- */

export const getIncomes = async (email) => {
  if (!email) return [];
  const res = await axios.get(`${API_URL}/incomes`, {
    params: { userEmail: email },
  });
  return res.data;
};

export const addIncome = async (incomeData) => {
  const res = await axios.post(`${API_URL}/incomes`, incomeData);
  return res.data;
};

export const deleteIncome = async (id) => {
  const res = await axios.delete(`${API_URL}/incomes/${id}`);
  return res.data;
};

/* --- GOALS --- */

export const getGoals = async (email) => {
  if (!email) return [];
  const res = await axios.get(`${API_URL}/goals`, {
    params: { userEmail: email },
  });
  return res.data;
};

export const addGoal = async (goalData) => {
  const res = await axios.post(`${API_URL}/goals`, goalData);
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await axios.delete(`${API_URL}/goals/${id}`);
  return res.data;
};

/* --- COMPANY: EMPLOYEES --- */
export const getEmployees = async (email) => {
  if (!email) return [];
  const res = await axios.get(`${API_URL}/company/employees`, { params: { userEmail: email } });
  return res.data;
};

export const addEmployee = async (data) => {
  const res = await axios.post(`${API_URL}/company/employees`, data);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${API_URL}/company/employees/${id}`);
  return res.data;
};

/* --- COMPANY: INVOICES --- */
export const getInvoices = async (email) => {
  if (!email) return [];
  const res = await axios.get(`${API_URL}/company/invoices`, { params: { userEmail: email } });
  return res.data;
};

export const addInvoice = async (data) => {
  const res = await axios.post(`${API_URL}/company/invoices`, data);
  return res.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/company/invoices/${id}/status`, { status });
  return res.data;
};