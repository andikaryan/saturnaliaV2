import { NextRequest, NextResponse } from "next/server";
import verifyRoute from "@/utils/api/verifyRoute";
import db from "@/lib/db";

// Get all shortlinks
export async function GET() {
  try {
    const shortlinks = await db.getShortlinks();
    
    return NextResponse.json(shortlinks);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error fetching shortlinks" },
      { status: 500 }
    );
  }
}

// Create or update a shortlink
export async function POST(request: NextRequest) {
  try {
    await verifyRoute(request);
    
    const { shortlink, longlink, id, domain_id } = await request.json();

    if (!shortlink || !longlink) {
      return NextResponse.json(
        { error: "Missing shortlink or longlink" },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing shortlink
      const result = await db.updateShortlink({ id, shortlink, longlink, domain_id });

      if (!result) {
        return NextResponse.json(
          { error: "Shortlink not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        id: id,
      });
    } else {      // Create new shortlink
      const result = await db.createShortlink({ shortlink, longlink, domain_id });

      return NextResponse.json({
        success: true,
        created: true,
        id: result.id,
      });
    }} catch (error) {
    console.error("Database error:", error);
    // Log more detailed information about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Error creating or updating shortlink" },
      { status: 500 }
    );
  }
}

// Delete a shortlink
export async function DELETE(request: NextRequest) {
  try {
    await verifyRoute(request);
    
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const success = await db.deleteShortlink(id);

    if (!success) {
      return NextResponse.json(
        { error: "Shortlink not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    // Log more detailed information about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Error deleting shortlink" },
      { status: 500 }
    );
  }
}
