"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-6 bg-white rounded-xl shadow-md border border-slate-100 max-w-sm">
        <p className="text-slate-600 font-medium mb-4">Registration is disabled. Redirecting to login...</p>
      </div>
    </div>
  );
}
