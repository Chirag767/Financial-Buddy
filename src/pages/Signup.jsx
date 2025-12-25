import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth";
import "../styles/auth.css"; 

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("individual");
  
  const [companyName, setCompanyName] = useState(""); 
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, userType, companyName);
      navigate(userType === "individual" ? "/dashboard/individual" : "/dashboard/company");
    } catch (err) {
      setError("Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>

        <h2 className="auth-title">Create Account 🚀</h2>
        <p className="auth-subtitle">Start managing your finances smarter</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="toggle-container">
            <button
              type="button"
              className={`toggle-btn ${userType === "individual" ? "active" : ""}`}
              onClick={() => setUserType("individual")}
            >
              Individual
            </button>
            <button
              type="button"
              className={`toggle-btn ${userType === "company" ? "active" : ""}`}
              onClick={() => setUserType("company")}
            >
              Company
            </button>
          </div>

          {userType === "company" && (
            <input
              className="auth-input"
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}

          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? 
          <span className="link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;