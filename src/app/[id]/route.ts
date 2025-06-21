import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { rows } = await sql`
      SELECT longlink FROM shortlinks 
      WHERE shortlink = ${id}
    `;

    if (rows.length > 0) {
      return NextResponse.redirect(new URL(rows[0].longlink));
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
