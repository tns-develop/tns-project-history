'use client'

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Project } from "../types/project"
import { useProjects } from "../contexts/ProjectsContext"
import { createProject, updateProject } from "../lib/api"

type ProjectFormProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

/**
 * カンマ区切りの文字列を配列に変換する関数
 * - 文字列をカンマで分割
 * - 各要素をトリムして空文字列を除去
 * - 結果をフィルタリングして空文字列を除去
 */
const splitComma = (value: string): string[] =>
  value.split(',').map(s => s.trim()).filter(Boolean)

/**
 * プロジェクトの追加・編集用フォームコンポーネント
 * - フォームバリデーション
 * - APIとの連携による保存処理
 * - カンマ区切りテキストの配列変換
 * - 既存データの編集対応
 */
export function ProjectForm({ project, isOpen, onClose }: ProjectFormProps) {
  const { dispatch } = useProjects()
  const { register, handleSubmit, reset } = useForm<Project>({
    defaultValues: project || {
      summary: '',
      role: '',
      teamSize: 1,
      impact: '',
      period: '',
      details: '',
      responsibilities: [],
      technologies: {
        languages: [],
        frameworks: [],
        tools: []
      },
      challenges: [],
      achievements: [],
      learnings: []
    }
  })

  const onSubmit = async (data: Project) => {
    try {
      if (project) {
        const updatedProject = await updateProject({ ...data, id: project.id })
        dispatch({ type: 'EDIT_PROJECT', payload: updatedProject })
      } else {
        const newProject = await createProject(data)
        dispatch({ type: 'ADD_PROJECT', payload: newProject })
      }
      onClose()
      reset()
    } catch (error) {
      console.error('プロジェクトの保存に失敗しました:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{project ? 'プロジェクトを編' : '新しいプロジェクトを追加'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="summary">プロジェクト概要</Label>
            <Input id="summary" {...register('summary', { required: true })} />
          </div>
          <div>
            <Label htmlFor="role">役割</Label>
            <Input id="role" {...register('role', { required: true })} />
          </div>
          <div>
            <Label htmlFor="teamSize">チーム規模</Label>
            <Input
              id="teamSize"
              type="number"
              {...register('teamSize', { required: true, valueAsNumber: true })}
            />
          </div>
          <div>
            <Label htmlFor="impact">プロジェクトの影響</Label>
            <Input id="impact" {...register('impact', { required: true })} />
          </div>
          <div>
            <Label htmlFor="period">期間</Label>
            <Input id="period" {...register('period', { required: true })} />
          </div>
          <div>
            <Label htmlFor="details">プロジェクト詳細</Label>
            <Textarea id="details" {...register('details', { required: true })} />
          </div>
          <div>
            <Label htmlFor="responsibilities">担当業務（カンマ区切り）</Label>
            <Textarea
              id="responsibilities"
              {...register('responsibilities', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.responsibilities.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="languages">使用言語（カンマ区切り）</Label>
            <Input
              id="languages"
              {...register('technologies.languages', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.technologies.languages.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="frameworks">フレームワーク（カンマ区切り）</Label>
            <Input
              id="frameworks"
              {...register('technologies.frameworks', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.technologies.frameworks.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="tools">ツール・技術（カンマ区切り）</Label>
            <Input
              id="tools"
              {...register('technologies.tools', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.technologies.tools.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="challenges">直面した課題（カンマ区切り）</Label>
            <Textarea
              id="challenges"
              {...register('challenges', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.challenges.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="achievements">主な成果（カンマ区切り）</Label>
            <Textarea
              id="achievements"
              {...register('achievements', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.achievements.join(',')}
            />
          </div>
          <div>
            <Label htmlFor="learnings">学んだこと（カンマ区切り）</Label>
            <Textarea
              id="learnings"
              {...register('learnings', {
                required: true,
                setValueAs: splitComma
              })}
              defaultValue={project?.learnings.join(',')}
            />
          </div>
          <Button type="submit">{project ? '更新' : '追加'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}