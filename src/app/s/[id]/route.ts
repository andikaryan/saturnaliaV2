import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shortCode = params.id;
    
    if (!shortCode) {
      console.error("No shortCode provided in slug");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Log the request details
    console.log(`Redirect request: URL=${request.url}, shortCode=${shortCode}`);
    
    // Look up the shortlink by the shortlink code
    const link = await db.getShortlinkBySlug(shortCode);
    
    if (link) {
      console.log(`Found link for ${shortCode}: ${JSON.stringify(link)}`);
      
      // Update click count
      await db.incrementClicks(shortCode);
      
      // Make sure the longlink has a protocol
      let targetUrl = link.longlink;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }
      
      console.log(`Redirecting to: ${targetUrl}`);
      return NextResponse.redirect(new URL(targetUrl));
    } else {
      console.error(`No link found for shortCode: ${shortCode}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Set revalidation to improve performance
export const dynamic = "force-dynamic";
