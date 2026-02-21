import { useNavigate } from "react-router-dom";

export default function Learn() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Fundamental of Science",
      description: "Learn the basics of Science and understand the principles of the world.",
      level: "Beginner",
    },
    {
      title: "Mathematics",
      description: "Mathematics which never bores you.",
      level: "Intermediate",
    },
    {
      title: "Computer and Technology",
      description: "Understand using MS office with Copilot.",
      level: "Advanced",
    },
    {
      title: "English Literature",
      description: "Learn different stories and words of the Poet.",
      level: "Beginner",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Explore Courses 📚</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">
              {course.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {course.description}
            </p>

            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              {course.level}
            </span>

            <button
              onClick={() => navigate(`/course/${course.title}`)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Start Learning
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}