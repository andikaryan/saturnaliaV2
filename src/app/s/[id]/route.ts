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
      if (process.env.NODE_ENV !== 'production') {
        console.error('No id provided in slug');
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Redirect request: URL=${request.url}, id=${id}`);
    }
    
    // Look up the shortlink by the shortlink code
    const link = await db.getShortlinkBySlug(id);
    
    if (!link) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`No link found for id: ${id}`);
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found link for ${id}:`, link);
    }
    
    // Update click count
    await db.incrementClicks(id);
    
    // Make sure the longlink has a protocol
    let targetUrl = link.longlink;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Redirecting to: ${targetUrl}`);
    }
    
    return NextResponse.redirect(new URL(targetUrl));
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in redirect:', error);
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const dynamic = 'force-dynamic';