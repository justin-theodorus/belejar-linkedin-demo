import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }

    const result = await q(
      "select id, name, email from users where email=$1 and password=$2",
      [email, password]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
