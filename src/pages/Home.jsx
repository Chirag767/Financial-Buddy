import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="glass-card">
        <h1 className="emoji-header">💰</h1>
        <h1 className="home-title">
          <span className="highlight">Financial Buddy</span>
        </h1>
        <p className="home-subtitle">
          Stop just tracking. Start understanding your spending habits with
          smart behavioral insights.
        </p>

        <div className="btn-container">
          <button 
            className="home-btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Login to Account
          </button>
          <button 
            className="home-btn btn-secondary"
            onClick={() => navigate("/signup")}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;