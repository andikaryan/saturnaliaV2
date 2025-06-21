import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import verifyRoute from "@/utils/api/verifyRoute";

// Get all domains
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM domains 
      ORDER BY id DESC
    `;
    
    return NextResponse.json(rows);
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
      // Update existing domain
      await sql`
        UPDATE domains 
        SET domain = ${domain} 
        WHERE id = ${id}
      `;

      return NextResponse.json({
        success: true,
        id: id,
      });
    } else {
      // Create new domain
      const { rows } = await sql`
        INSERT INTO domains (domain) 
        VALUES (${domain}) 
        RETURNING id
      `;

      return NextResponse.json({
        success: true,
        created: true,
        id: rows[0].id,
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

    await sql`
      DELETE FROM domains 
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error deleting domain" },
      { status: 500 }
    );
  }
}
