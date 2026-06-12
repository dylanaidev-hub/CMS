import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CMS_SESSION_COOKIE, isCmsAuthenticated } from '@/lib/cms-auth';

const protectedRoutePattern = /^\/dashboard(?:\/.*)?$/;

export default function middleware(req: NextRequest) {
  const isProtectedRoute = protectedRoutePattern.test(req.nextUrl.pathname);
  const isAuthenticated = isCmsAuthenticated(req.cookies.get(CMS_SESSION_COOKIE)?.value);

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    signInUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (req.nextUrl.pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard/news', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
