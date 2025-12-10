'use client'

import { Filter, X } from "lucide-react"

import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

import { Project } from "../types"

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
  )).sort()

  const clearFilters = () => onFilterChange([])

  return (
    <div className="mb-8 rounded-xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">技術フィルター</h2>
            <p className="text-sm text-muted-foreground">
              クリックして絞り込み
            </p>
          </div>
        </div>
        {selectedFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
            クリア ({selectedFilters.length})
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTechnologies.map(tech => {
          const isSelected = selectedFilters.includes(tech)
          return (
            <Badge
              key={tech}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border/50 hover:border-primary hover:bg-primary/5 hover:text-primary"
              }`}
              onClick={() => {
                onFilterChange(
                  isSelected
                    ? selectedFilters.filter(f => f !== tech)
                    : [...selectedFilters, tech]
                )
              }}
            >
              {tech}
            </Badge>
          )
        })}
      </div>

      {selectedFilters.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 text-sm">
          <span className="text-muted-foreground">選択中:</span>
          <div className="flex flex-wrap gap-1">
            {selectedFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <button
                  onClick={() => onFilterChange(selectedFilters.filter(f => f !== filter))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
