"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="max-w-lg w-full bg-slate-900/60 backdrop-blur-xl border border-red-900/50 rounded-3xl p-8 shadow-2xl shadow-red-900/20 text-center relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-800/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-red-950 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-900/50">
              <AlertOctagon className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              Critical Error
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed text-lg">
              A fatal application error occurred. The application could not be rendered completely.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mb-8 p-4 bg-black/50 rounded-xl text-left border border-red-900/30 overflow-auto text-sm font-mono text-red-400 shadow-inner">
                <p className="font-semibold mb-2 uppercase tracking-wider text-xs text-red-500">Error Details</p>
                <p className="break-words">{error.message || "Unknown Fatal Error"}</p>
                {error.digest && (
                  <p className="mt-2 text-slate-500 text-xs">Digest: {error.digest}</p>
                )}
              </div>
            )}

            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-500/30"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Attempt Recovery</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
