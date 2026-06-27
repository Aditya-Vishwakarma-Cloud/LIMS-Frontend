import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read refresh token from cookies
  const hasRefreshToken = request.cookies.has('refreshToken');

  // Define protected paths
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/sample') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/customer');

  // If path is protected and user does not have a refresh token cookie, redirect to login
  if (isProtectedPath && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated (has cookie) and tries to access login/register, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && hasRefreshToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
