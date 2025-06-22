import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// Define params interface according to Next.js 15
interface Params {
  code: string;
}

// Follow the exact Next.js 15 pattern for route handlers
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  // Extract code directly without destructuring
  const code = params.code;
  
  try {
    console.log(`API redirect called for code: ${code}`);
      if (!code) {
      console.error("No code provided");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Look up the shortlink
    const link = await db.getShortlinkBySlug(code);
      if (link) {
      console.log(`Found link for ${code}: ${JSON.stringify(link)}`);
      
      // Update click count
      await db.incrementClicks(code);
      
      // Make sure the longlink has a protocol
      let targetUrl = link.longlink;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }
      
      console.log(`Redirecting to: ${targetUrl}`);
      return NextResponse.redirect(new URL(targetUrl));    } else {
      console.error(`No link found for code: ${code}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error in API redirect:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const dynamic = "force-dynamic";
