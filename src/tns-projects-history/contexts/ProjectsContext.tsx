'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { Project, Action } from '../types/project'
import { fetchProjects } from '../lib/api'

/**
 * プロジェクト管理用のコンテキスト
 * プロジェクトの一覧データと更新用のディスパッチ関数を提供
 */
const ProjectsContext = createContext<{
  projects: Project[]
  dispatch: React.Dispatch<Action>
} | null>(null)

/**
 * プロジェクトの状態を管理するReducer
 * - プロジェクトの追加
 * - プロジェクトの編集
 * - プロジェクトの削除
 */
const projectReducer = (state: Project[], action: Action): Project[] => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return [...state, action.payload]
    case 'EDIT_PROJECT':
      return state.map(project => project.id === action.payload.id ? action.payload : project)
    case 'DELETE_PROJECT':
      return state.filter(project => project.id !== action.payload)
    default:
      return state
  }
}

/**
 * プロジェクト管理用のProviderコンポーネント
 * - プロジェクトデータの初期読み込み
 * - プロジェクトの状態管理
 * - コンテキストを通じたデータ共有
 */
export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, dispatch] = useReducer(projectReducer, [])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects()
        data.forEach(project => {
          dispatch({ type: 'ADD_PROJECT', payload: project })
        })
      } catch (error) {
        console.error('プロジェクトの読み込みに失敗しました:', error)
      }
    }
    loadProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, dispatch }}>
      {children}
    </ProjectsContext.Provider>
  )
}

/**
 * プロジェクトコンテキストを使用するためのカスタムフック
 * - プロジェクトデータへのアクセス
 * - プロジェクトの更新処理の提供
 * @throws {Error} ProjectsProviderの外で使用された場合
 */
export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}