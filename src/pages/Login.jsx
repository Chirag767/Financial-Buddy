import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);
      
      const type = data.userType || "individual"; 
      
      localStorage.setItem("userType", type);
      localStorage.setItem("email", email); 

      if (type === "company") {
        navigate("/dashboard/company");
      } else {
        navigate("/dashboard/individual");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        
        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Login to your Financial Buddy account</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
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
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? 
          <span className="link" onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;