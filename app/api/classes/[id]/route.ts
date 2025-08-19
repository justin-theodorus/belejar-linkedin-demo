import { NextResponse } from "next/server";
import { q } from "@/lib/db";

type Params = { params: { id: string } };


export async function GET(_req: Request, { params }: Params) {
  const res = await q(
    `select id, title, description, instructor_id, created_at, updated_at
     from classes where id=$1`,
    [params.id]
  );
  if (res.rowCount === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ class: res.rows[0] });
}


export async function PUT(req: Request, { params }: Params) {
  try {
    const { title, description, instructorId } = await req.json();


    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (title !== undefined) { fields.push(`title=$${i++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description=$${i++}`); values.push(description); }
    if (instructorId !== undefined) { fields.push(`instructor_id=$${i++}`); values.push(instructorId); }
    fields.push(`updated_at=now()`);

    if (values.length === 0) {
      return NextResponse.json({ error: "no fields to update" }, { status: 400 });
    }

    const sql = `update classes set ${fields.join(", ")} where id=$${i} returning id, title, description, instructor_id, created_at, updated_at`;
    values.push(params.id);

    const res = await q(sql, values);
    if (res.rowCount === 0) return NextResponse.json({ error: "not found" }, { status: 404 });

    return NextResponse.json({ class: res.rows[0] });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const res = await q("delete from classes where id=$1 returning id", [params.id]);
  if (res.rowCount === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
