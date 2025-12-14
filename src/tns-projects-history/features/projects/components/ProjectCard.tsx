'use client'

import { motion } from "framer-motion"
import { CalendarIcon, EditIcon, TrendingUpIcon, UsersIcon } from "lucide-react"


import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

import type { Project } from "../../types"


type ProjectCardProps = {
  project: Project
  onViewDetails: () => void
  onEdit: () => void
}

/**
 * 個別のプロジェクトカードを表示するコンポーネント
 * - プロジェクトの概要情報を表示
 * - アニメーション効果付きのカードUI
 * - 詳細表示と編集機能へのアクセス提供
 */
export function ProjectCard({ project, onViewDetails, onEdit }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
        <CardContent className="flex h-full flex-col p-6">
          {/* Header */}
          <h2 className="mb-4 line-clamp-2 text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.summary}
          </h2>

          {/* Meta Info */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <span>{project.period}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <UsersIcon className="h-4 w-4" />
              </div>
              <span>{project.role} (チーム{project.teamSize}名)</span>
            </div>
          </div>

          {/* Impact */}
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            <TrendingUpIcon className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{project.impact}</span>
          </div>

          {/* Technologies */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {project.technologies.languages
              .concat(project.technologies.frameworks)
              .slice(0, 4)
              .map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {tech}
                </Badge>
              ))}
            {project.technologies.languages.length + project.technologies.frameworks.length > 4 && (
              <Badge variant="outline" className="border-dashed">
                +{project.technologies.languages.length + project.technologies.frameworks.length - 4}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
            <Button onClick={onViewDetails} size="sm" className="gap-2">
              詳細を見る
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9 text-muted-foreground hover:text-primary"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
