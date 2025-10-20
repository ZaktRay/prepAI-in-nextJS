'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Clock, CheckCircle, ArrowLeft, ArrowRight, X, Trophy, Target, TrendingUp, RotateCcw } from 'lucide-react';

export default function Test() {
    const router = useRouter();
    const storedData = sessionStorage.getItem('testData');

    if(!storedData){
        router.replace('/upload');
    }

    const test = JSON.parse(storedData);

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [isTestSubmitted, setIsTestSubmitted] = useState(false);

    useEffect(() => {
        return () => {
            sessionStorage.clear();
        };
    }, []);

    const validQuestions = test?.filter(q => q.options.length > 0);
    const totalQuestions = validQuestions?.length;

    const handleAnswerSelect = (questionIndex, option) => {

        if (isTestSubmitted) return;

        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: option
        });
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setIsTestSubmitted(true);


        let correctCount = 0;
        const results = validQuestions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const correctAnswer = question.answer;
            const isCorrect = userAnswer[0] === correctAnswer[0];
            if (isCorrect) correctCount++;

            return {
                question: question.question,
                userAnswer: userAnswer || 'Not answered',
                correctAnswer: correctAnswer,
                isCorrect: isCorrect,
                options: question.options
            };
        });

        const score = Math.round((correctCount / totalQuestions) * 100);

        const data = {
            fileName: sessionStorage.getItem("fileName"),
            title: test[0].question,
            score: score,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            results: results,
            timeSpent: '25:30'
        };

        setTestResults(data);
        setShowResults(true);

    };

    const answeredQuestions = Object.keys(selectedAnswers).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    const closeResults = () => {
        setShowResults(false);
    };

    const retakeTest = () => {
        setSelectedAnswers({});
        setCurrentQuestion(0);
        setShowResults(false);
        setTestResults(null);
        setIsTestSubmitted(false);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col items-center gap-4 justify-between mb-6 lg:flex-row">
                            <div className="flex items-center space-x-4">

                                <div className='text-center lg:text-left'>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        AI Generated Test
                                    </h1>
                                    <p className="text-gray-600 mt-1">{test[0].question}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                                    <Brain className="w-4 h-4" />
                                    <span className="text-sm font-semibold">AI Powered</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-semibold text-gray-700">25:30</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">
                                    Question {currentQuestion + 1} of {totalQuestions}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                    {answeredQuestions}/{totalQuestions} Answered
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
                        <div className="mb-8">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-white font-bold text-lg">{currentQuestion + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                                        {validQuestions[currentQuestion]?.question}
                                    </h2>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4 lg:ml-16">
                                {validQuestions[currentQuestion]?.options.map((option, optionIndex) => {
                                    const isSelected = selectedAnswers[currentQuestion] === option;
                                    return (
                                        <button
                                            key={optionIndex}
                                            onClick={() => handleAnswerSelect(currentQuestion, option)}
                                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                : isTestSubmitted
                                                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            disabled={isTestSubmitted}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : isTestSubmitted
                                                        ? 'border-gray-300 bg-gray-200'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`font-medium ${isSelected ? 'text-blue-700' :
                                                    isTestSubmitted ? 'text-gray-500' : 'text-gray-700'
                                                    }`}>
                                                    {option}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${currentQuestion === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-50 text-gray-700 hover:shadow-xl border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        <div className="flex items-center space-x-4">
                            {/* Question Numbers */}
                            <div className="hidden sm:flex items-center space-x-2">
                                {validQuestions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentQuestion(index)}
                                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${index === currentQuestion
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : selectedAnswers[index]
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(currentQuestion === totalQuestions - 1) && (totalQuestions == Object.keys(selectedAnswers).length) ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isTestSubmitted}
                                className={`flex items-center space-x-2 px-8 py-3 font-semibold rounded-2xl transition-all duration-300 shadow-lg ${isTestSubmitted
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:shadow-xl'
                                    }`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>{isTestSubmitted ? 'Test Submitted' : 'Submit Test'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={currentQuestion == totalQuestions - 1}
                                className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${currentQuestion === totalQuestions - 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:bg-gray-50 text-white hover:shadow-xl border border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span>Next</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Popup */}
            {showResults && testResults && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Test Results
                                        </h2>
                                        <p className="text-gray-600 mt-1">Binary Search Tree - Data Structures</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeResults}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-all duration-200"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Score Overview */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                {/* Circular Score Chart */}
                                <div className="lg:col-span-1 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Score</h3>
                                        <div className="relative w-32 h-32 mx-auto mb-4">
                                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                                                {/* Background circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="52"
                                                    fill="none"
                                                    stroke="#e5e7eb"
                                                    strokeWidth="8"
                                                />
                                                {/* Progress circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="52"
                                                    fill="none"
                                                    stroke={testResults.score >= 80 ? "#10b981" : testResults.score >= 60 ? "#f59e0b" : "#ef4444"}
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(testResults.score / 100) * 327} 327`}
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-3xl font-bold ${testResults.score >= 80 ? 'text-emerald-600' :
                                                    testResults.score >= 60 ? 'text-amber-600' : 'text-red-600'
                                                    }`}>
                                                    {testResults.score}%
                                                </span>
                                                <span className="text-xs text-gray-500">Score</span>
                                            </div>
                                        </div>
                                        <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${testResults.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                            testResults.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {testResults.score >= 80 ? 'Excellent!' : testResults.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Summary</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Target className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{testResults.correctCount}/{testResults.totalQuestions}</p>
                                            <p className="text-sm text-gray-600">Correct Answers</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Clock className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{testResults.timeSpent}</p>
                                            <p className="text-sm text-gray-600">Time Spent</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{Math.round((testResults.correctCount / testResults.totalQuestions) * 100)}%</p>
                                            <p className="text-sm text-gray-600">Accuracy</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Brain className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">AI</p>
                                            <p className="text-sm text-gray-600">Generated</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Results */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6 mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Question by Question Review</h3>
                                <div className="space-y-6 max-h-96 overflow-y-auto">
                                    {testResults.results.map((result, index) => (
                                        <div key={index} className={`p-4 rounded-2xl border-2 ${result.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                                            }`}>
                                            <div className="flex items-start space-x-3 mb-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm ${result.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 mb-2">{result.question}</p>
                                                    <div className="space-y-2 text-sm">
                                                        <div className={`flex items-center space-x-2 ${result.isCorrect ? 'text-emerald-700' : 'text-red-700'
                                                            }`}>
                                                            <span className="font-medium">Your answer:</span>
                                                            <span>{result.userAnswer}</span>
                                                        </div>
                                                        {!result.isCorrect && (
                                                            <div className="flex items-center space-x-2 text-emerald-700">
                                                                <span className="font-medium">Correct answer:</span>
                                                                <span>{result.correctAnswer}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${result.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`}>
                                                    {result.isCorrect ? (
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center space-x-4">
                                <button
                                    onClick={retakeTest}
                                    className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Retake Test</span>
                                </button>
                                <button
                                    onClick={closeResults}
                                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <span>Close Results</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
