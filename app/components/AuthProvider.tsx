"use client";

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Microscope } from 'lucide-react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { clearAuth, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.refresh();
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuth, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Loading LIMS Services...</h2>
          <p className="text-sm text-gray-500">Checking credentials, please wait.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
