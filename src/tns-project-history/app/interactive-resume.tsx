"use client"

import { useState, useReducer } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, UsersIcon, TrendingUpIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react"

type Project = {
  id: number
  summary: string
  role: string
  teamSize: number
  impact: string
  period: string
  details: string
  responsibilities: string[]
  technologies: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  }
  challenges: string[]
  achievements: string[]
  learnings: string[]
}

type Action =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'EDIT_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: number }

const projectReducer = (state: Project[], action: Action): Project[] => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return [...state, action.payload]
    case 'EDIT_PROJECT':
      return state.map(project => project.id === action.payload.id ? action.payload : project)
    case 'DELETE_PROJECT':
      return state.filter(project => project.id !== action.payload)
    default:
      return state
  }
}

const initialProjects: Project[] = [
  {
    id: 1,
    summary: "大規模ECサイトリニューアル",
    role: "リードエンジニア",
    teamSize: 8,
    impact: "売上30%増加",
    period: "2022.04 - 2022.12",
    details: "年間売上100億円規模の大手小売業のECサイトのフルリニューアルプロジェクト。パフォーマンスとSEOの改善に注力し、モバイルファーストの設計を採用。",
    responsibilities: ["プロジェクト全体の技術設計", "フロントエンド開発リード", "パフォーマンス最適化", "チームマネジメント"],
    technologies: {
      languages: ["TypeScript", "Python"],
      frameworks: ["Next.js", "Django"],
      tools: ["Docker", "AWS", "GitHub Actions"]
    },
    challenges: [
      "レガシーシステムからの大規模データ移行",
      "高トラフィック時のパフォーマンス維持"
    ],
    achievements: [
      "ページロード時間を50%削減",
      "モバイルコンバージョン率を20%向上",
      "検索エンジンからの自然流入を40%増加"
    ],
    learnings: [
      "大規模プロジェクトのリードとしてのマネジメントスキル向上",
      "パフォーマンス最適化技術の深い理解と実践"
    ]
  },
  // 他のプロジェクトを追加...
]

export default function InteractiveResume() {
  const [projects, dispatch] = useReducer(projectReducer, initialProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filters, setFilters] = useState<string[]>([])

  const { register, handleSubmit, control, reset } = useForm<Project>()

  const onSubmit = (data: Project) => {
    if (isEditModalOpen) {
      dispatch({ type: 'EDIT_PROJECT', payload: { ...data, id: selectedProject!.id } })
      setIsEditModalOpen(false)
    } else {
      dispatch({ type: 'ADD_PROJECT', payload: { ...data, id: Date.now() } })
      setIsAddModalOpen(false)
    }
    reset()
  }

  const handleDelete = (id: number) => {
    if (window.confirm('このプロジェクトを削除してもよろしいですか？')) {
      dispatch({ type: 'DELETE_PROJECT', payload: id })
    }
  }

  const filteredProjects = projects.filter(project =>
    filters.length === 0 || filters.some(filter =>
      project.technologies.languages.includes(filter) ||
      project.technologies.frameworks.includes(filter) ||
      project.technologies.tools.includes(filter)
    )
  )

  const allTechnologies = projects.flatMap(project => [
    ...project.technologies.languages,
    ...project.technologies.frameworks,
    ...project.technologies.tools
  ])
  const uniqueTechnologies = [...new Set(allTechnologies)]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">インタラクティブ職務経歴書</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">フィルター</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueTechnologies.map(tech => (
            <Badge
              key={tech}
              variant={filters.includes(tech) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilters(prev =>
                prev.includes(tech) ? prev.filter(f => f !== tech) : [...prev, tech]
              )}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">
        <PlusIcon className="mr-2 h-4 w-4" /> 新しいプロジェクトを追加
      </Button>

      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                    <Button onClick={() => setSelectedProject(project)}>詳細を見る</Button>
                    <div>
                      <Button variant="outline" size="icon" className="mr-2" onClick={() => {
                        setSelectedProject(project)
                        setIsEditModalOpen(true)
                      }}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(project.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.summary}</DialogTitle>
            <DialogDescription>{selectedProject?.period} | {selectedProject?.role}</DialogDescription>
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
                    <p>{selectedProject?.details}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">担当業務</h3>
                    <ul className="list-disc pl-5">
                      {selectedProject?.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">プロジェクトの影響</h3>
                    <p className="text-green-600 font-medium">{selectedProject?.impact}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tech">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">使用言語</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject?.technologies.languages.map((lang) => (
                        <Badge key={lang} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">フレームワーク</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject?.technologies.frameworks.map((framework) => (
                        <Badge key={framework} variant="outline">{framework}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">ツール・技術</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject?.technologies.tools.map((tool) => (
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
                      {selectedProject?.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">主な成果</h3>
                    <ul className="list-disc pl-5">
                      {selectedProject?.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">学んだこと</h3>
                    <ul className="list-disc pl-5">
                      {selectedProject?.learnings.map((learning, index) => (
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

      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={() => {
        setIsAddModalOpen(false)
        setIsEditModalOpen(false)
        reset()
      }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? 'プロジェクトを編集' : '新しいプロジェクトを追加'}</DialogTitle>
          </DialogHeader>
          <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="summary">プロジェクト概要</Label>
              <Input id="summary" {...register('summary', { required: true })} defaultValue={selectedProject?.summary} />
            </div>
            <div>
              <Label htmlFor="role">役割</Label>
              <Input id="role" {...register('role', { required: true })} defaultValue={selectedProject?.role} />
            </div>
            <div>
              <Label htmlFor="teamSize">チーム規模</Label>
              <Input id="teamSize" type="number" {...register('teamSize', { required: true, valueAsNumber: true })} defaultValue={selectedProject?.teamSize} />
            </div>
            <div>
              <Label htmlFor="impact">プロジェクトの影響</Label>
              <Input id="impact" {...register('impact', { required: true })} defaultValue={selectedProject?.impact} />
            </div>
            <div>
              <Label htmlFor="period">期間</Label>
              <Input id="period" {...register('period', { required: true })} defaultValue={selectedProject?.period} />
            </div>
            <div>
              <Label htmlFor="details">プロジェクト詳細</Label>
              <Textarea id="details" {...register('details', { required: true })} defaultValue={selectedProject?.details} />
            </div>
            <div>
              <Label htmlFor="responsibilities">担当業務（カンマ区切り）</Label>
              <Textarea id="responsibilities" {...register('responsibilities', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.responsibilities.join(',')} />
            </div>
            <div>
              <Label htmlFor="languages">使用言語（カンマ区切り）</Label>
              <Input id="languages" {...register('technologies.languages', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.technologies.languages.join(',')} />
            </div>
            <div>
              <Label htmlFor="frameworks">フレームワーク（カンマ区切り）</Label>
              <Input id="frameworks" {...register('technologies.frameworks', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.technologies.frameworks.join(',')} />
            </div>
            <div>
              <Label htmlFor="tools">ツール・技術（カンマ区切り）</Label>
              <Input id="tools" {...register('technologies.tools', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.technologies.tools.join(',')} />
            </div>
            <div>
              <Label htmlFor="challenges">直面した課題（カンマ区切り）</Label>
              <Textarea id="challenges" {...register('challenges', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.challenges.join(',')} />
            </div>
            <div>
              <Label htmlFor="achievements">主な成果（カンマ区切り）</Label>
              <Textarea id="achievements" {...register('achievements', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.achievements.join(',')} />
            </div>
            <div>
              <Label htmlFor="learnings">学んだこと（カンマ区切り）</Label>
              <Textarea id="learnings" {...register('learnings', { required: true, setValueAs: v => v.split(',') })} defaultValue={selectedProject?.learnings.join(',')} />
            </div>
            <Button type="submit">{isEditModalOpen ? '更新' : '追加'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}