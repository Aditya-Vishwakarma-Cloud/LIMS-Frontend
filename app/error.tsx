"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 flex items-center justify-center p-4 text-slate-100">
      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-rose-900/50 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-500/30">
            <AlertTriangle className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 mb-2">
            Something went wrong!
          </h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            We encountered an unexpected error while trying to process your request. Our systems have logged the issue.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-black/40 rounded-xl text-left border border-rose-900/30 overflow-auto text-sm font-mono text-rose-300">
              <p className="font-semibold mb-1">Error Message:</p>
              <p className="break-words">{error.message || "Unknown Error"}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all duration-200 border border-slate-700"
            >
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
