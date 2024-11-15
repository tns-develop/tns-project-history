'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UsersIcon, TrendingUpIcon, EditIcon } from "lucide-react"
import { Project } from "../types/project"
import { motion } from 'framer-motion'

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">{project.summary}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{project.period}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <UsersIcon className="w-4 h-4" />
            <span>{project.role} (チーム{project.teamSize}名)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 mb-4">
            <TrendingUpIcon className="w-4 h-4" />
            <span>{project.impact}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.languages.concat(project.technologies.frameworks).slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
            {project.technologies.languages.length + project.technologies.frameworks.length > 3 && (
              <Badge variant="outline">+{project.technologies.languages.length + project.technologies.frameworks.length - 3}</Badge>
            )}
          </div>
          <div className="flex justify-between">
            <Button onClick={onViewDetails}>詳細を見る</Button>
            <Button variant="outline" size="icon" onClick={onEdit}>
              <EditIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}