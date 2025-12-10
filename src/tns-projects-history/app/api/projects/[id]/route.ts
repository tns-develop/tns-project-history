import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<Record<string, string | string[]>>
}

/**
 * IDパラメータを検証して数値に変換する
 * @param idParam - パラメータから取得したID
 * @returns 検証済みの数値ID
 * @throws 無効なIDの場合は400エラーを返す
 */
function validateAndParseId(idParam: string | string[] | undefined): number {
  const idString = Array.isArray(idParam) ? idParam[0] : idParam

  if (!idString || typeof idString !== 'string') {
    throw new Error('Invalid ID parameter')
  }

  const id = Number(idString)

  if (Number.isNaN(id) || !Number.isFinite(id) || id <= 0) {
    throw new Error('Invalid ID parameter')
  }

  return id
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const params = await context.params
    const idParam = params?.id
    const id = validateAndParseId(idParam)
    const project = await request.json()
    // データベース更新処理
    return NextResponse.json({ ...project, id })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid ID parameter' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const params = await context.params
    const idParam = params?.id
    const id = validateAndParseId(idParam)
    // データベース削除処理
    return NextResponse.json({ deleted: id })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid ID parameter' },
      { status: 400 }
    )
  }
}