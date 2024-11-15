import { NextResponse } from 'next/server'
import type { Project } from '../../../types/project'

// 注: この実装は例示用です。実際の環境では適切なデータベースを使用してください。
let projects: Project[] = [
  // initialProjectsの内容をここに移動
]

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const project = await request.json()
  const newProject = { ...project, id: Date.now() }
  projects.push(newProject)
  return NextResponse.json(newProject)
}