import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, classId } = await req.json();
    if (!userId || !classId) {
      return NextResponse.json({ error: "userId and classId required" }, { status: 400 });
    }


    const user = await q("select id from users where id=$1", [userId]);
    const selectedClass = await q("select id from classes where id=$1", [classId]);
    if (user.rowCount === 0) return NextResponse.json({ error: "user not found" }, { status: 404 });
    if (selectedClass.rowCount === 0) return NextResponse.json({ error: "class not found" }, { status: 404 });

    const res = await q(
      `insert into enrollments (user_id, class_id)
       values ($1,$2)
       on conflict (user_id, class_id) do nothing
       returning id, user_id, class_id, created_at`,
      [userId, classId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "already enrolled" }, { status: 409 });
    }

    return NextResponse.json({ enrollment: res.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
