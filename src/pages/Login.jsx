import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      console.log("Phantom detected");
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.solana) {
        alert("Phantom wallet not found! Install it.");
        return;
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();

      setWalletAddress(publicKey);

      // Redirect after successful connection
      setTimeout(() => {
        navigate("/chat");
      }, 1000);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)"
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "30px",
          borderRadius: "16px",
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          color: "white",
          textAlign: "center"
        }}
      >
        <h1>AI Study Buddy 🤖</h1>

        {!walletAddress ? (
          <button
            onClick={connectWallet}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Connect Phantom Wallet
          </button>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p>Connected:</p>
            <strong>{walletAddress.slice(0, 6)}...
              {walletAddress.slice(-4)}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;