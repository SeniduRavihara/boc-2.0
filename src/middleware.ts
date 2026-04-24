import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define paths that should ALWAYS be accessible (Admin, API, Static Assets)
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // for favicon, images, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Allow only Session 1 registration
  const session1Path = '/register/session/1';
  
  // 2.1 Check for reveal-home password (query param or cookie)
  const revealPassword = process.env.REVEAL_HOME_PASSWORD || '1234';
  const revealHomeQuery = request.nextUrl.searchParams.get('reveal-home');
  const revealHomeCookie = request.cookies.get('reveal-home')?.value;

  if (revealHomeQuery === revealPassword || revealHomeCookie === revealPassword) {
    const response = NextResponse.next();
    
    // Set cookie if it's coming from query param to persist access
    if (revealHomeQuery === revealPassword && revealHomeCookie !== revealPassword) {
      response.cookies.set('reveal-home', revealPassword, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }
    return response;
  }
  
  // If we are already on session 1, allow it
  if (pathname === session1Path) {
    return NextResponse.next();
  }

  // 3. Redirect everything else (Home page, other sessions, competition registration, etc.) to Session 1
  return NextResponse.redirect(new URL(session1Path, request.url));
}

// Optional: Limit middleware to specific paths if needed, 
// but here we want a global catch-all except for the exclusions above.
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
