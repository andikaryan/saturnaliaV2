import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import verifyRoute from "@/utils/api/verifyRoute";

// Get all shortlinks
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM shortlinks 
      ORDER BY id DESC
    `;
    
    return NextResponse.json(rows);
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
      await sql`
        UPDATE shortlinks 
        SET longlink = ${longlink}, shortlink = ${shortlink}, domain_id = ${domain_id} 
        WHERE id = ${id}
      `;

      return NextResponse.json({
        success: true,
        id: id,
      });
    } else {
      // Create new shortlink
      const { rows } = await sql`
        INSERT INTO shortlinks (shortlink, longlink, domain_id) 
        VALUES (${shortlink}, ${longlink}, ${domain_id}) 
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

    await sql`
      DELETE FROM shortlinks 
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error deleting shortlink" },
      { status: 500 }
    );
  }
}
