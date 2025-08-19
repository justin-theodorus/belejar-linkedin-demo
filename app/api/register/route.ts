import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, password required" }, { status: 400 });
    }

    const existing = await q("select id from users where email=$1", [email]);
    if (existing.rowCount > 0) {
      return NextResponse.json({ error: "email already used" }, { status: 409 });
    }

    const result = await q(
      `insert into users (name, email, password)
       values ($1,$2,$3)
       returning id, name, email, created_at`,
      [name, email, password]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
