import { Project } from '../types/project'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`)
  if (!response.ok) {
    throw new Error('プロジェクトの取得に失敗しました')
  }
  return response.json()
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })
  if (!response.ok) {
    throw new Error('プロジェクトの作成に失敗しました')
  }
  return response.json()
}

export async function updateProject(project: Project): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })
  if (!response.ok) {
    throw new Error('プロジェクトの更新に失敗しました')
  }
  return response.json()
}

export async function deleteProject(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('プロジェクトの削除に失敗しました')
  }
}