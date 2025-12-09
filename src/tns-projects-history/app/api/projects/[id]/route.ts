import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = await request.json()
  // データベース更新処理
  return NextResponse.json({ ...project, id: Number(params.id) })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // データベース削除処理
  return NextResponse.json({ deleted: Number(params.id) })
}