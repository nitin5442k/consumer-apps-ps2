import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuizComponent from './QuizComponent';

export default function CourseDetail() {
  const { title } = useParams();

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [walletAddress, setWalletAddress] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintResult, setMintResult] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${encodeURIComponent(title)}`
        );
        if (!res.ok) throw new Error("failed to fetch course");
        const data = await res.json();
        setLessons(data.lessons || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error("course fetch error:", err);
      }
    };
    fetchCourse();
  }, [title]);

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading course...</p>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex] || "";
  const progress = lessons.length > 0
    ? Math.min((completedLessons.length / lessons.length) * 100, 100)
    : 0;

  // handle messaging with gemini backend
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: title,
          lesson: currentLesson,
          question: userMessage,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.answer || "no response from ai." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: `error: ${err.message}` }]);
    }
    setLoading(false);
  };

  // handle quiz completion and progress
  const handleQuizPass = () => {
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons((prev) => [...prev, currentLesson]);
    }
    setShowQuiz(false);
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setMessages([]);
    }
  };

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("connection cancelled");
      }
    } else {
      alert("please install phantom wallet!");
    }
  };

  const handleMint = async () => {
    if (!walletAddress) return alert("connect your wallet first!");
    setMintLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: title,
          walletAddress: walletAddress
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "minting failed");
      setMintResult(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* progress bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-8">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Lesson {currentIndex + 1}: {currentLesson}
        </h2>

        <div className="h-72 overflow-y-auto bg-gray-100 p-4 rounded-lg mb-4">
          {messages.length === 0 && (
            <p className="text-gray-500">Ask AI anything about this lesson...</p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}>
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <p className="text-gray-500">AI is thinking...</p>}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className="flex-1 border p-2 rounded-lg"
          />
          <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => setShowQuiz(true)}
            className="relative z-50 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
          >
            Take Lesson Quiz
          </button>
        </div>
      </div>

      {showQuiz && (
        <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden">
          <button
            onClick={() => setShowQuiz(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold"
          >
            ✕ Close Quiz
          </button>

          <QuizComponent
            courseTitle={title}
            walletAddress={walletAddress}
            onPass={handleQuizPass}
          />
        </div>
      )}

      {/* nft certificate section */}
      <div className="bg-blue-900 p-8 rounded-3xl shadow-2xl text-white text-center mt-10">
        <h2 className="text-3xl font-black mb-4">Claim Your Certificate</h2>

        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all mx-auto"
          >
            Connect Phantom Wallet
          </button>
        ) : !mintResult ? (
          <div>
            <p className="mb-4 text-blue-200">
              Ready to mint for: <span className="font-mono bg-blue-800 px-2 py-1 rounded">
                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              </span>
            </p>
            <button
              onClick={handleMint}
              disabled={mintLoading}
              className={`w-full max-w-sm py-4 rounded-xl font-black text-xl shadow-lg transition-all ${mintLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-400"
                }`}
            >
              {mintLoading ? "Processing..." : "Mint NFT Certificate"}
            </button>
          </div>
        ) : (
          <div className="bg-blue-800 p-6 rounded-2xl">
            <p className="text-green-400 font-bold text-xl mb-2">Successfully Minted!</p>
            <a
              href={mintResult.explorerLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 underline text-sm"
            >
              View Transaction on Solana Explorer ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}