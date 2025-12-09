import { Suspense } from 'react'
import { ProjectsLoading, ProjectsList, ProjectsProvider } from '@/features'

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
