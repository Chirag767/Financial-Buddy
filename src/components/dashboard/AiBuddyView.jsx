import React from "react";
import Chatbot from "../Chatbot";
import "../../styles/ai-buddy.css";

const AiBuddyView = ({ expenses, incomes, goals, userType }) => {
  return (
    <div className="ai-view">
      <header className="ai-view__header">
        <h2 className="ai-view__title">AI Financial Consultant 🤖</h2>
        <p className="ai-view__subtitle">
          Your personal advisor is ready. Ask about your spending patterns, bill management, or saving strategies.
        </p>
      </header>

      <div className="ai-view__chat-container">
        <Chatbot 
          expenses={expenses} 
          incomes={incomes} 
          goals={goals} 
          userType={userType} 
        />
      </div>
    </div>
  );
};

export default AiBuddyView;