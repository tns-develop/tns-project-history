export type Project = {
  id: number
  summary: string
  role: string
  teamSize: number
  impact: string
  period: string
  details: string
  responsibilities: string[]
  technologies: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  challenges: string[]
  achievements: string[]
  learnings: string[]
}

export type Action =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'EDIT_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: number }