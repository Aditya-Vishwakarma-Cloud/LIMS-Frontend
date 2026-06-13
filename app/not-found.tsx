"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 text-slate-100">
      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-500/30">
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-slate-200">Page Not Found</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the digital void. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
            >
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all duration-200 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
