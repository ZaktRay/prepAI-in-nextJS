'use client'
import { useEffect, useState } from 'react';
import { User as UserIcon, Mail, Brain, FileText, TrendingUp, Calendar, BookOpen, Upload, Zap, Award, LogOut, Play } from 'lucide-react';
import Link from 'next/link';
import { deleteCookie } from '@/lib/cookie';
import { useRouter } from "next/navigation";


const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        sessionStorage.clear();
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setIsLoading(false);
        setUser(data.user);
        console.log("this is response", data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const logOut = async () => {
    await deleteCookie();
    router.replace('/dashboard');

  }

  const totalQuestions = user?.tests?.reduce((sum, test) => sum + test.totalQuestions, 0);
  const totalCorrect = user?.tests?.reduce((sum, test) => sum + test.correctCount, 0);
  const overallAccuracy = totalQuestions && totalCorrect ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const averageScore = user?.tests?.length ? (user.tests.reduce((sum, test) => sum + test.score, 0) / user.tests?.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className=" justify-between mb-4 lg:flex lg:items-center">
            <div className="flex items-center space-x-3 w-full lg:w-[50%]">
              <div className='text-center lg:text-left'>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Study Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Track your AI-generated test performance and study progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-between">
              <Link href="/upload">
                <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-2xl border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Take Test</span>
                </button>
              </Link>
              <button onClick={logOut} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-6 lg:flex">
              <div className="flex items-center space-x-4 w-full">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-56" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-500 font-medium">ID: {user?._id}</p>
                      <div className="flex items-center text-gray-600 mt-2">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-12 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{user?.tests?.length}</p>
                    <p className="text-sm text-gray-600 font-medium">AI Tests Taken</p>
                  </>
                )}
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                    <p className="text-sm text-gray-600 font-medium">Average Score</p>
                  </>
                )}
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-12 mx-auto mb-2" />
                    <Skeleton className="h-4 w-28 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{user?.tests?.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Study Materials</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Overall Accuracy</h3>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex flex-col items-center">
              {isLoading ? (
                <>
                  <Skeleton className="w-36 h-36 rounded-full mb-6" />
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </>
              ) : (
                <>
                  <div className="relative w-36 h-36 mb-6">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 144 144">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        className="drop-shadow-sm"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(overallAccuracy / 100) * 377} 377`}
                        className="transition-all duration-1000 ease-out drop-shadow-sm"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#6366F1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {overallAccuracy}%
                      </span>
                      <span className="text-xs text-gray-500 font-medium">Accuracy</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-gray-900">{totalCorrect}</span> correct out of{' '}
                      <span className="font-semibold text-gray-900">{totalQuestions}</span> questions
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">AI-Generated Tests</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col text-center items-center justify-between lg:flex-row lg:text-left">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Test Results</h3>
                <p className="text-gray-600">Detailed breakdown of your performance on AI-created MCQ tests</p>
              </div>
              <div className="flex items-center space-x-3">
                {isLoading ? (
                  <Skeleton className="h-10 w-48 rounded-2xl" />
                ) : (
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">Last updated: {user?.updatedAt && formatDate(user.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Test & Source</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Performance</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Score</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">AI Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(3)].map((_, index) => (
                    <tr key={index} className="hover:bg-blue-50/30 transition-all duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-start space-x-4">
                          <Skeleton className="w-12 h-12 rounded-2xl" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-48 mb-2" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-8 w-16 mx-auto" />
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="w-8 h-8 rounded-xl" />
                          <div>
                            <Skeleton className="h-5 w-12 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  user?.tests?.map((test, index) => (
                    <tr key={test.id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                      <td className="px-8 py-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${test.fileName ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                            {test.fileName ? (
                              <FileText className={`w-6 h-6 ${test.fileName ? 'text-red-600' : 'text-blue-600'}`} />
                            ) : (
                              <Upload className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {test.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">{test.fileName}</p>
                            <div className="flex items-center mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor('medium')}`}>
                                {'medium'.charAt(0).toUpperCase() + 'medium'.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {test.correctCount}/{test.totalQuestions}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round((test.correctCount / test.totalQuestions) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${(test.correctCount / test.totalQuestions) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-center">
                          <span className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                            {test.score}%
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Final Score</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(test.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {test.timeSpent}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">95%</p>
                            <p className="text-xs text-gray-500">AI Confidence</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
