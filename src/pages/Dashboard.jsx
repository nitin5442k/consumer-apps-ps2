import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">
          AI Study Buddy 🤖
        </h2>

        <ul className="space-y-4">
          <li
            onClick={() => navigate("/dashboard")}
            className="hover:text-gray-300 cursor-pointer"
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/learn")}
            className="hover:text-gray-300 cursor-pointer"
          >
            Learn
          </li>

          <li className="hover:text-gray-300 cursor-pointer">
            Certificates
          </li>

          <li className="hover:text-gray-300 cursor-pointer">
            Settings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">
          Welcome Back 👋
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Courses Enrolled</h3>
            <p className="text-2xl font-bold">3</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Hours Learned</h3>
            <p className="text-2xl font-bold">24h</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Certificates</h3>
            <p className="text-2xl font-bold">1</p>
          </div>
        </div>
      </div>

    </div>
  );
}