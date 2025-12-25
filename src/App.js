import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import IndividualDashboard from "./pages/IndividualDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard/individual" element={<IndividualDashboard />} />
      <Route path="/dashboard/company" element={<CompanyDashboard />} />
    </Routes>
  );
}

export default App;