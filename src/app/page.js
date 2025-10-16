import Link from "next/link";
import { Brain, LogIn } from 'lucide-react';

export default function Home() {
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">

        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
          AI Study Platform
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform your study materials into personalized AI-generated tests. Upload your notes,
          get instant MCQ tests, and track your learning progress with intelligent insights.
        </p>

        <Link href='/login'>
          <button
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-lg">Get Started</span>
          </button>
        </Link>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Powered</h3>
            <p className="text-sm text-gray-600">Smart question generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Easy Upload</h3>
            <p className="text-sm text-gray-600">Upload files or paste notes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your learning</p>
          </div>
        </div>
      </div>
    </div>
  )
}
