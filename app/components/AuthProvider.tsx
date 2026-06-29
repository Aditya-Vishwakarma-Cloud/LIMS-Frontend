"use client";

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Microscope } from 'lucide-react';
import LoadingSpinner from './shared/LoadingSpinner';

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
        <div className="text-center flex flex-col items-center">
          <LoadingSpinner />
          <h2 className="text-lg font-semibold text-gray-700 mt-4">Loading LIMS Services...</h2>
          <p className="text-sm text-gray-500">Checking credentials, please wait.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
