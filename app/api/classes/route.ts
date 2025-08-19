import { NextResponse } from "next/server";
import { q } from "@/lib/db";


export async function GET() {
  const result = await q(
    `select id, title, description, instructor_id, created_at, updated_at
     from classes
     order by created_at desc`
  );
  return NextResponse.json({ classes: result.rows });
}


export async function POST(req: Request) {
  try {
    const { title, description, instructorId } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 });
    }

    const result = await q(
      `insert into classes (title, description, instructor_id)
       values ($1,$2,$3)
       returning id, title, description, instructor_id, created_at, updated_at`,
      [title, description, instructorId ?? null]
    );

    return NextResponse.json({ class: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
