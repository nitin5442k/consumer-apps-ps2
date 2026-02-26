import { useParams } from "react-router-dom";
import { useState } from "react";

export default function CourseDetail() {
  const { title } = useParams();

  const [currentLesson, setCurrentLesson] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const lessons = [
    "What is Science?",
    "Scientific Methods",
    "Laws of Nature",
    "Energy & Matter",
    "Final Review",
  ];

  const askAI = async () => {
    if (!question || !currentLesson) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle: title,
          lesson: currentLesson,
          question: question,
        }),
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      setResponse("Error contacting AI tutor.");
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Lesson List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Lessons
          </h3>

          <ul className="space-y-3">
            {lessons.map((lesson, index) => (
              <li
                key={index}
                onClick={() => {
                  setCurrentLesson(lesson);
                  setResponse("");
                }}
                className={`p-3 rounded-lg cursor-pointer ${
                  currentLesson === lesson
                    ? "bg-indigo-100"
                    : "hover:bg-gray-100"
                }`}
              >
                {lesson}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Tutor Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow flex flex-col">

          {!currentLesson ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a lesson to start learning 🤖
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">
                AI Tutor — {currentLesson}
              </h2>

              {/* Response Area */}
              <div className="flex-1 bg-gray-50 p-4 rounded-lg mb-4 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500">Thinking...</p>
                ) : response ? (
                  <p className="whitespace-pre-line">{response}</p>
                ) : (
                  <p className="text-gray-400">
                    Ask a question about this lesson.
                  </p>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask something..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={askAI}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg transition"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}