import { Suspense } from 'react'
import { ProjectsProvider } from '../contexts/ProjectsContext'
import { ProjectsList } from '../components/ProjectsList'
import { ProjectsLoading } from '../components/ProjectsLoading'

export default function ProjectsPage() {
  return (
    <ProjectsProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">インタラクティブ職務経歴書</h1>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsList />
        </Suspense>
      </div>
    </ProjectsProvider>
  )
}
