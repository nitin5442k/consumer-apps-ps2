import { useParams } from "react-router-dom";
import { useState } from "react";

export default function CourseDetail() {
  const { title } = useParams();

  const courseVideos = {
    "Fundamental of Science": [
      "What is Science?",
      "Scientific Methods",
      "Laws of Nature",
      "Energy & Matter",
      "Final Review",
    ],
    "Mathematics": [
      "Introduction to Algebra",
      "Geometry Basics",
      "Trigonometry",
      "Calculus Intro",
      "Practice Problems",
    ],
    "Computer and Technology": [
      "MS Word Basics",
      "MS Excel Essentials",
      "PowerPoint Mastery",
      "Copilot Introduction",
      "Tech Summary",
    ],
    "English Literature": [
      "Poetry Introduction",
      "Classic Stories",
      "Shakespeare Basics",
      "Modern Literature",
      "Final Reflection",
    ],
  };

  const videos = courseVideos[title] || [];

  const [currentVideo, setCurrentVideo] = useState(videos[0] || "");
  const [completed, setCompleted] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);

  const markCompleted = (video) => {
  if (!completed.includes(video)) {
    setCompleted([...completed, video]);

    const currentIndex = videos.indexOf(video);

    if (currentIndex > maxUnlockedIndex) {
      setMaxUnlockedIndex(currentIndex);
    }
  }
};

  const progress =
    videos.length > 0
      ? (completed.length / videos.length) * 100
      : 0;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            {currentVideo}
          </h2>

          <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
            🎥 Video Player Placeholder
          </div>

          <button
            onClick={() => markCompleted(currentVideo)}
            disabled={completed.includes(currentVideo)}
            className={`px-4 py-2 rounded-lg transition ${
              completed.includes(currentVideo)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {completed.includes(currentVideo)
              ? "Completed"
              : "Mark as Completed"}
          </button>
        </div>

        {/* Lesson List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Course Lessons
          </h3>

          <ul className="space-y-3">
            {videos.map((video, index) => (
              <li
                key={index}
                onClick={() => {
                  if (
                    index ===0 ||
                    index <= maxUnlockedIndex ||
                    completed.includes(videos[index - 1])
                    
                  ) {
                    setCurrentVideo(video);
                  } else {
                    setPendingIndex(index);
                    setShowWarning(true);
                  }
                }}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                  currentVideo === video
                    ? "bg-indigo-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{video}</span>

                {completed.includes(video) && (
                  <span className="text-green-600 font-bold">
                    ✓
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Complete Previous Lesson
            </h2>

            <p className="mb-6 text-gray-600">
              You must complete the previous lecture or pass
              the assessment to unlock this lesson.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Go Back
              </button>

              <button
                onClick={() => {
                  setMaxUnlockedIndex(pendingIndex);
                  setShowWarning(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Unlock via Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}