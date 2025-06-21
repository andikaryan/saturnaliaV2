import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const link = await db.getShortlinkBySlug(id);
    
    if (link) {
      // Update click count
      await db.incrementClicks(id);
      
      return NextResponse.redirect(new URL(link.longlink));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Set revalidation to improve performance
export const dynamic = "force-dynamic";
