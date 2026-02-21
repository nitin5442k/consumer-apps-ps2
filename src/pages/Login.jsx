import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-[420px] text-center border border-white/20">

        <h1 className="text-4xl font-bold text-white mb-3">
          AI Study Buddy 🤖
        </h1>

        <p className="text-gray-200 mb-8">
          Your Personal AI Learning Companion
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition duration-300 hover:scale-105 shadow-lg"
        >
          Enter Dashboard
        </button>

      </div>
    </div>
  );
}