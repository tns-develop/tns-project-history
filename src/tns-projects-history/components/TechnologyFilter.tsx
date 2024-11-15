'use client'

import { Badge } from "@/components/ui/badge"
import { Project } from "../types/project"

type TechnologyFilterProps = {
  projects: Project[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

/**
 * 技術スタックによるフィルタリングコンポーネント
 * - プロジェクトに使用されている全技術の抽出
 * - 選択状態の切り替え可能なフィルターUI
 * - プロジェクト一覧のフィルタリング制御
 */
export function TechnologyFilter({ projects, selectedFilters, onFilterChange }: TechnologyFilterProps) {
  // すべての技術を抽出して重複を除去
  const allTechnologies = Array.from(new Set(
    projects.flatMap(project => [
      ...project.technologies.languages,
      ...project.technologies.frameworks,
      ...project.technologies.tools
    ])
  ))

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">フィルター</h2>
      <div className="flex flex-wrap gap-2">
        {allTechnologies.map(tech => (
          <Badge
            key={tech}
            variant={selectedFilters.includes(tech) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              onFilterChange(
                selectedFilters.includes(tech)
                  ? selectedFilters.filter(f => f !== tech)
                  : [...selectedFilters, tech]
              )
            }}
          >
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  )
}