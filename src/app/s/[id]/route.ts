import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Define params interface according to Next.js 15
interface Params {
  id: string;
}

// Follow the exact Next.js 15 pattern for route handlers
export async function GET(request: NextRequest, { params }: { params: Params }) {
  // Extract id directly without destructuring
  const id = params.id;
  
  try {
    
    if (!id) {
      // Always log in production
      console.error('No id provided in slug');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Always log request info, even in production
    console.log(`[S] Redirect request: URL=${request.url}, id=${id}, isBrowser: ${typeof window !== 'undefined'}`);
    console.log(`[S] Headers: ${JSON.stringify(Object.fromEntries(request.headers))}`);
    console.log(`[S] URL origin: ${request.url}`);
    console.log(`[S] Environment: ${process.env.NODE_ENV}`);
    console.log(`[S] Is Server Component: ${typeof window === 'undefined'}`);
    
    
    // Look up the shortlink by the shortlink code
    const link = await db.getShortlinkBySlug(id);
    
    if (!link) {
      // Always log in production
      console.error(`[S] No link found for id: ${id}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Always log, even in production
    console.log(`[S] Found link for ${id}:`, link);
    
    // Update click count
    await db.incrementClicks(id);
    
    // Make sure the longlink has a protocol
    let targetUrl = link.longlink;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    
    // Always log in production
    console.log(`[S] Redirecting to: ${targetUrl}`);
    
    try {
      // Use direct URL object to avoid URL parsing issues
      return NextResponse.redirect(targetUrl);
    } catch (error) {
      console.error('[S] Error redirecting:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in redirect:', error);
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const dynamic = 'force-dynamic';