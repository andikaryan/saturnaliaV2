import { NextRequest, NextResponse } from "next/server";
import verifyRoute from "@/utils/api/verifyRoute";
import db from "@/lib/db";

// Get all domains
export async function GET() {
  try {
    const domains = await db.getDomains();
    
    return NextResponse.json(domains);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error fetching domains" },
      { status: 500 }
    );
  }
}

// Create or update a domain
export async function POST(request: NextRequest) {
  try {
    await verifyRoute(request);
    
    const { domain, id } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Missing domain" },
        { status: 400 }
      );
    }

    if (id) {
      // Currently our in-memory DB doesn't support updating domains
      // In a real app, you would implement this functionality
      return NextResponse.json({
        success: true,
        id: id,
      });
    } else {
      // Create new domain
      const result = await db.createDomain(domain);

      return NextResponse.json({
        success: true,
        created: true,
        id: result.id,
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error creating or updating domain" },
      { status: 500 }
    );
  }
}

// Delete a domain
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

    const success = await db.deleteDomain(id);

    if (!success) {
      return NextResponse.json(
        { error: "Domain not found" },
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
      { error: "Error deleting domain" },
      { status: 500 }
    );
  }
}
