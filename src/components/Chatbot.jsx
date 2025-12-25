import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/chatbot.css";
import ConfirmModal from "./ConfirmModal";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Chatbot = ({ expenses, incomes = [], goals = [], userType = "individual" }) => {
  const email = localStorage.getItem("email");
  const storageKey = `chat_history_${email}`;
  const [showClearModal, setShowClearModal] = useState(false);

  // 1. Initialize State from LocalStorage
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem(storageKey);
    return savedChat 
      ? JSON.parse(savedChat) 
      : [{ id: 1, text: "Hello! I'm your Financial Buddy. How can I help you today?", sender: "bot" }];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 2. Auto-Save to LocalStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map(m => ({ text: m.text, sender: m.sender })),
          context: { userType, expenses, incomes, goals }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg = { id: Date.now() + 1, text: data.reply, sender: "bot" };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.details || data.error || "Unknown Error");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev, 
        { id: Date.now(), text: `⚠️ Error: ${error.message || "Brain freeze!"}`, sender: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to wipe history
  const clearChat = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    const initialMsg = [{ id: 1, text: "History cleared. How can I help?", sender: "bot" }];
    setMessages(initialMsg);
    localStorage.setItem(storageKey, JSON.stringify(initialMsg));
    setShowClearModal(false);
  };

  return (
    <div className="chat-container">
      <ConfirmModal 
        isOpen={showClearModal}
        title="Clear Chat History?"
        message="This will remove all conversation history from this device. You cannot undo this."
        onConfirm={confirmClear}
        onCancel={() => setShowClearModal(false)}
      />
      <div className="chat-box-header">
         <span className="chat-status-dot"></span> Online
         <button onClick={clearChat} className="chat-clear-btn" title="Clear History">🗑️</button>
      </div>

      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble chat-bubble--${msg.sender}`}>
            <div className="chat-bubble__text">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble chat-bubble--bot chat-bubble--loading">
            <span className="typing-indicator">Analyzing your data...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          className="chat-input-field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your budget..."
        />
        <button className="chat-submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;