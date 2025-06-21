import { NextResponse, NextRequest } from 'next/server';

// Export the middleware function correctly
export function middleware(request: NextRequest) {  // Get the host from the request
  const host = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware called: host=${host}, pathname=${pathname}`);
    // Extract the first part of the path for special slugs
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0] || '';

  // Check if the first segment is "s" (for shortened URLs)
  if (firstSegment === 's' && pathSegments.length > 1) {
    console.log('Detected shortlink path');
    
    // Extract the shortlink ID from the path
    // e.g., /s/abc123 -> abc123
    const shortlinkId = pathSegments[1];
    if (shortlinkId) {
      console.log(`Handling shortlink: ${shortlinkId}`);
      
      // Rewrite to the dynamic route handler
      const url = new URL(`/${shortlinkId}`, 'http://localhost:3000');
      return NextResponse.rewrite(url);
    }
  }
  
  // Continue with normal processing for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, API routes, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
