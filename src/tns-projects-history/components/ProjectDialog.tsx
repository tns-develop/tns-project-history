'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Project } from "../types/project"

type ProjectDialogProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

/**
 * プロジェクトの詳細情報を表示するモーダルコンポーネント
 * - タブ切り替えによる情報の整理（概要/技術スタック/課題と成果）
 * - スクロール可能なコンテンツエリア
 * - 詳細な情報の階層的表示
 */
export function ProjectDialog({ project, isOpen, onClose }: ProjectDialogProps) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{project.summary}</DialogTitle>
          <DialogDescription>{project.period} | {project.role}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] mt-4">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="tech">技術スタック</TabsTrigger>
              <TabsTrigger value="challenges">課題と成果</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">プロジェクト詳細</h3>
                  <p>{project.details}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">担当業務</h3>
                  <ul className="list-disc pl-5">
                    {project.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">プロジェクトの影響</h3>
                  <p className="text-green-600 font-medium">{project.impact}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">使用言語</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">フレームワーク</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.frameworks.map((framework) => (
                      <Badge key={framework} variant="outline">{framework}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ツール・技術</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.tools.map((tool) => (
                      <Badge key={tool} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">直面した課題</h3>
                  <ul className="list-disc pl-5">
                    {project.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">主な成果</h3>
                  <ul className="list-disc pl-5">
                    {project.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">学んだこと</h3>
                  <ul className="list-disc pl-5">
                    {project.learnings.map((learning, index) => (
                      <li key={index}>{learning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}