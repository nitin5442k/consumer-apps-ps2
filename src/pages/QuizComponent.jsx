import React, { useState, useEffect } from 'react';

const QuizComponent = ({ courseTitle, walletAddress, onPass }) => {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const API_BASE = "http://localhost:5000/api/quiz";

    // fetch quiz questions from the api
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/${encodeURIComponent(courseTitle)}`);
                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setQuestions(data);
                }
            } catch (err) {
                setError("Failed to load quiz. Please check if backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [courseTitle]);

    // update state when a user selects an option
    const handleOptionChange = (questionIndex, selectedOption) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: selectedOption
        });
    };

    // submit answers and check results
    const handleSubmit = async () => {
        setSubmitting(true);
        const answersArray = questions.map((_, index) => userAnswers[index]);

        try {
            const response = await fetch(`${API_BASE}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseTitle,
                    answers: answersArray,
                    walletAddress: walletAddress
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            alert("Error submitting quiz.");
        } finally {
            setSubmitting(false);
        }
    };

    const isComplete = questions.length > 0 && Object.keys(userAnswers).length === questions.length;

    if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Loading Quiz...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

    // display results after submission
    if (result) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border-2 border-blue-100 rounded-2xl shadow-xl text-center">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Quiz Results</h2>
                <div className={`text-6xl font-black mb-4 ${result.passed ? 'text-green-500' : 'text-blue-500'}`}>
                    {result.score}%
                </div>
                <p className="text-xl mb-6 text-gray-600">
                    {result.passed ? "🎉 Congratulations! You passed." : "⏳ Not quite there yet. Keep studying!"}
                </p>

                <div className="flex gap-4 justify-center">
                    {result.passed ? (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-200">
                            Mint NFT Certificate 🚀
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-all"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto my-10 p-6">
            <header className="mb-8 border-b border-blue-100 pb-4">
                <h1 className="text-2xl font-bold text-blue-900">{courseTitle} Quiz</h1>
                <p className="text-gray-500">Answer all questions to qualify for your NFT certificate.</p>
            </header>

            <div className="space-y-6">
                {questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                            {qIdx + 1}. {q.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((option, oIdx) => (
                                <label
                                    key={oIdx}
                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${userAnswers[qIdx] === option
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${qIdx}`}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        onChange={() => handleOptionChange(qIdx, option)}
                                        checked={userAnswers[qIdx] === option}
                                    />
                                    <span className="ml-3 text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isComplete || submitting}
                className={`w-full mt-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${isComplete && !submitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {submitting ? "Submitting Answers..." : "Submit Quiz"}
            </button>
        </div>
    );
};

export default QuizComponent;