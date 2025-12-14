'use client'


import { AnimatePresence, motion } from 'framer-motion'
import { FolderOpen, PlusIcon } from 'lucide-react'
import { useState } from 'react'

import { ProjectCard } from './ProjectCard'
import { ProjectDialog } from './ProjectDialog'
import { ProjectForm } from './ProjectForm'
import { TechnologyFilter } from './TechnologyFilter'

import type { Project } from '../../types'

import { useProjects } from '@/features/providers/projects-context'
import { Button } from '@/shared/ui/button'

/**
 * プロジェクト一覧を表示するメインコンポーネント
 * - プロジェクトのフィルタリング機能
 * - プロジェクトの追加・編集・詳細表示の制御
 * - プロジェクトカードのグリッドレイアウト表示
 */
export function ProjectsList() {
  const { projects } = useProjects()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filters, setFilters] = useState<string[]>([])

  const filteredProjects = projects.filter(project =>
    filters.length === 0 || filters.some(filter =>
      project.technologies.languages.includes(filter) ||
      project.technologies.frameworks.includes(filter) ||
      project.technologies.tools.includes(filter)
    )
  )

  return (
    <>
      <TechnologyFilter
        projects={projects}
        selectedFilters={filters}
        onFilterChange={setFilters}
      />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProjects.length}</span>
            {" "}件のプロジェクト
            {filters.length > 0 && (
              <span className="ml-1">
                ({projects.length}件中)
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <PlusIcon className="h-4 w-4 font-bold" />
          新規プロジェクトを追加
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">プロジェクトが見つかりません</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            {filters.length > 0
              ? "フィルター条件を変更してみてください"
              : "最初のプロジェクトを追加しましょう"}
          </p>
          {filters.length > 0 && (
            <Button variant="outline" onClick={() => setFilters([])}>
              フィルターをクリア
            </Button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={() => setSelectedProject(project)}
                onEdit={() => {
                  setSelectedProject(project)
                  setIsEditModalOpen(true)
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <ProjectDialog
        project={selectedProject}
        isOpen={selectedProject !== null && !isEditModalOpen}
        onClose={() => setSelectedProject(null)}
      />

      <ProjectForm
        project={isEditModalOpen ? selectedProject : null}
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setIsEditModalOpen(false)
          setSelectedProject(null)
        }}
      />
    </>
  )
}
