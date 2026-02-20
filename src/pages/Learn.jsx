import { useState, useRef, useEffect } from "react";

function Learn() {
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  useEffect(()=> {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[message]);

  const handleSend = () => {
    if (message.trim() === "") return;

    const userMessage = message;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);

    // Clear input immediately
    setMessage("");

    // Fake AI reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "This is a sample AI response 🤖" }
      ]);
    }, 800);
  };

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #0f172a, #1e3a8a)"
        : "#f3f4f6",
      transition: "0.3s ease"
    }}
  >
    <div
      style={{
        width: "420px",
        backdropFilter: "blur(12px)",
        backgroundColor: darkMode
          ? "rgba(255,255,255,0.08)"
          : "white",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        color: darkMode ? "white" : "black",
        border: darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "none"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>AI Study Buddy 🤖</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: "none",
            border: "none",
            color: darkMode ? "white" : "black",
            cursor: "pointer"
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          margin: "15px 0",
          padding: "10px",
          borderRadius: "12px",
          backgroundColor: darkMode
            ? "rgba(255,255,255,0.05)"
            : "#f9fafb"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === "user"
                  ? "#2563eb"
                  : darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "#e5e7eb",
              padding: "8px 14px",
              borderRadius: "20px",
              marginBottom: "8px",
              maxWidth: "70%",
              color:
                msg.sender === "user" || darkMode
                  ? "white"
                  : "black"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
            backgroundColor: darkMode
              ? "rgba(255,255,255,0.1)"
              : "white",
            color: darkMode ? "white" : "black"
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "10px 18px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  </div>
);
}

export default Learn;
