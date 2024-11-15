import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const project = await request.json()
  // データベース更新処理
  return NextResponse.json(project)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  // データベース削除処理
  return new NextResponse(null, { status: 204 })
}