import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content-Security-Policy header
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.vercel-analytics.com cdn.segment.com *.stripe.com",
      "script-src-elem 'self' 'unsafe-inline' cdn.vercel-analytics.com cdn.segment.com *.stripe.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' cdn.vercel-analytics.com *.stripe.com *.algolia.net *.algolianet.com",
      "frame-src *.stripe.com",
    ].join("; "),
  );

  // Additional security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
