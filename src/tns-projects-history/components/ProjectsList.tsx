'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjects } from '../contexts/ProjectsContext'
import { ProjectCard } from './ProjectCard'
import { ProjectDialog } from './ProjectDialog'
import { ProjectForm } from './ProjectForm'
import { TechnologyFilter } from './TechnologyFilter'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Project } from '../types/project'

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

      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">
        <PlusIcon className="mr-2 h-4 w-4" /> 新しいプロジェクトを追加
      </Button>

      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <ProjectDialog
        project={selectedProject}
        isOpen={selectedProject !== null}
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