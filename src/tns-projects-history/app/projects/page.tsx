import { Briefcase } from "lucide-react"
import { Suspense } from "react"

import { ProjectsLoading, ProjectsList, ProjectsProvider } from "@/features"

export default function ProjectsPage(): JSX.Element {
  return (
    <ProjectsProvider>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-background/80 backdrop-blur">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  プロジェクト一覧
                </h1>
                <p className="mt-1 text-muted-foreground">
                  技術スタックやキーワードでフィルタリングできます
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Suspense fallback={<ProjectsLoading />}>
            <ProjectsList />
          </Suspense>
        </div>
      </div>
    </ProjectsProvider>
  )
}
