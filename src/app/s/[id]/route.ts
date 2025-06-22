import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const shortCode = params.id;
    
    if (!shortCode) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('No shortCode provided in slug');
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Redirect request: URL=${request.url}, shortCode=${shortCode}`);
    }
    
    // Look up the shortlink by the shortlink code
    const link = await db.getShortlinkBySlug(shortCode);
    
    if (!link) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`No link found for shortCode: ${shortCode}`);
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found link for ${shortCode}:`, link);
    }
    
    // Update click count
    await db.incrementClicks(shortCode);
    
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