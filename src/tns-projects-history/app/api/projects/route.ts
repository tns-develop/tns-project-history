import { NextResponse } from 'next/server'

import type { Project } from '../../../features/types'

// 注: この実装は例示用です。実際の環境では適切なデータベースを使用してください。
let projects: Project[] = [
  // initialProjectsの内容をここに移動
]

export async function GET(): Promise<NextResponse<Project[]>> {
  return NextResponse.json(projects)
}

export async function POST(request: Request): Promise<NextResponse<Project>> {
  const project = await request.json()
  const newProject = { ...project, id: Date.now() }
  projects = [...projects, newProject]
  return NextResponse.json(newProject)
}