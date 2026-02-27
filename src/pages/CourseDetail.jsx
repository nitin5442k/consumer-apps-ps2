import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function CourseDetail() {
  const { title } = useParams();

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${encodeURIComponent(title)}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await res.json();
        setLessons(data.lessons || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Course fetch error:", err);
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


  // 🔥 SEND MESSAGE TO BACKEND (Gemini)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle: title,
          lesson: currentLesson,
          question: userMessage,
        }),
      });

      // 🔥 SHOW REAL ERROR
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        throw new Error(errorText);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "No response from AI." },
      ]);

    } catch (err) {
      console.error("Frontend catch error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${err.message}` },
      ]);
    }

    setLoading(false);
  };


  // 🔥 QUIZ PASS LOGIC
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

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-8">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AI Tutor Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Lesson {currentIndex + 1}: {currentLesson}
        </h2>

        {/* Chat Window */}
        <div className="h-72 overflow-y-auto bg-gray-100 p-4 rounded-lg mb-4">
          {messages.length === 0 && (
            <p className="text-gray-500">
              Ask AI anything about this lesson...
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 ${msg.role === "user"
                ? "text-right"
                : "text-left"
                }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300"
                  }`}
              >
                {msg.text}
              </span>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500">AI is thinking...</p>
          )}
        </div>

        {/* Input Section */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>

        {/* Quiz Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => setShowQuiz(true)}
            disabled={completedLessons.includes(currentLesson)}
            className={`px-4 py-2 rounded-lg ${completedLessons.includes(currentLesson)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white"
              }`}
          >
            {completedLessons.includes(currentLesson)
              ? "Lesson Completed"
              : "Take Quiz"}
          </button>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Quick Quiz
            </h2>

            <p className="mb-6">
              (Placeholder quiz — assume user scored 70%)
            </p>

            <button
              onClick={handleQuizPass}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* NFT Certificate Section */}
      {progress === 100 && (
        <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4">
            🎓 All Lessons Completed!
          </h2>

          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
            Claim NFT Certificate (Solana)
          </button>
        </div>
      )}
    </div>
  );
}