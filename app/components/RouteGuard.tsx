"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { RoleName } from '@/types/auth.types';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: RoleName[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && user) {
        const hasRequiredRole = user.roles.some((role) =>
          allowedRoles.includes(role)
        );
        if (!hasRequiredRole) {
          router.push('/dashboard?error=unauthorized');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null; 
  }

  if (allowedRoles && user) {
    const hasRequiredRole = user.roles.some((role) =>
      allowedRoles.includes(role)
    );
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
