'use client'
import { useState } from 'react';
import { Upload, FileText, Type, Brain, ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners"

export default function uploadFile() {
    const router = useRouter();
    const [inputMode, setInputMode] = useState('upload');
    const [selectedFile, setSelectedFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const formData = new FormData();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (inputMode === 'upload' && selectedFile) {
                formData.append('pdf', selectedFile);
            }
            else if (inputMode === 'text' && textInput.trim()) {
                formData.append('text', textInput);
            }
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            console.log(data);
            setIsLoading(false);
            sessionStorage.setItem('testData',JSON.stringify(data.questions));
            sessionStorage.setItem('fileName',selectedFile.name)
            router.push('/test');
        }
        catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };

    const canSubmit = (inputMode === 'upload' && selectedFile) || (inputMode === 'text' && textInput.trim());

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col space-y-3 items-center justify-between mb-6 lg:flex-row">
                        <div className="flex items-center space-x-4">
                            <div className='text-center lg:text-left'>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Create AI Test
                                </h1>
                                <p className="text-gray-600 mt-1">Upload your study materials or paste your notes to generate an AI-powered MCQ test</p>
                            </div>
                        </div>
                        <div className="w-[40%] flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-2xl shadow-lg lg:w-[15%]">
                            <Brain className="w-4 h-4" />
                            <span className="text-sm font-semibold">AI Powered</span>
                        </div>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 w-fit">
                        <button
                            onClick={() => setInputMode('upload')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${inputMode === 'upload'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload File</span>
                        </button>
                        <button
                            onClick={() => setInputMode('text')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${inputMode === 'text'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <Type className="w-4 h-4" />
                            <span>Type Notes</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                    {inputMode === 'upload' ? (
                        /* File Upload Section */
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Study Material</h2>
                                <p className="text-gray-600">Upload your PDF notes, documents, or study materials</p>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${isDragging
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedFile
                                        ? 'border-emerald-400 bg-emerald-50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {selectedFile ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                            <FileText className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            disabled={isLoading}
                                            onClick={() => setSelectedFile(null)}
                                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900 mb-2">
                                                Drag and drop your file here
                                            </p>
                                            <p className="text-gray-500 mb-4">or</p>
                                            <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
                                                <Plus className="w-4 h-4" />
                                                <span>Choose File</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.txt"
                                                    onChange={handleFileSelect}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Text Input Section */
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Paste Your Notes</h2>
                                <p className="text-gray-600">Type or paste your study notes directly</p>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Paste your study notes here... 

For example:
• Machine Learning is a subset of artificial intelligence
• Supervised learning uses labeled data for training
• Common algorithms include linear regression, decision trees, and neural networks
• Cross-validation helps prevent overfitting..."
                                    className="w-full h-80 p-6 border-2 border-gray-200 rounded-3xl focus:border-blue-500 focus:outline-none resize-none text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                                />
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{textInput.length} characters</span>
                                    <span>Minimum 100 characters recommended</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit || isLoading}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${canSubmit
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? <div className='mx-5'><ClipLoader color="#ffffff" loading={true} size={23} /></div> : <div className='flex items-center gap-4'>
                                <Brain className="w-5 h-5" />
                                <span>Generate AI Test</span> </div>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}