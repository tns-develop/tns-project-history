import { ArrowRight, Briefcase, Code2, FolderKanban, Layers } from "lucide-react"
import Link from "next/link"

import { Button } from "@/shared/ui/button"

const features = [
  {
    icon: <FolderKanban className="h-6 w-6" />,
    title: "プロジェクト管理",
    description: "職務経歴上のプロジェクトを整理し、技術スタックや成果を一元管理",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "技術フィルター",
    description: "言語・フレームワーク・ツールでプロジェクトを素早く絞り込み",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "詳細表示",
    description: "各プロジェクトの詳細情報をインタラクティブに確認",
  },
]

export default function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Briefcase className="h-4 w-4" />
              職務経歴ポートフォリオ
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              プロジェクト実績を
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                効果的に可視化
              </span>
            </h1>

            {/* Description */}
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              インタラクティブな職務経歴書で、
              <br className="hidden sm:block" />
              あなたの技術力とプロジェクト経験を印象的にアピール。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/projects">
                  プロジェクト一覧を見る
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">主な機能</h2>
            <p className="text-muted-foreground">
              職務経歴の可視化に必要な機能を揃えています
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
            今すぐプロジェクトを確認
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            インタラクティブな職務経歴書で、スキルセットを探索しましょう
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/projects">
              プロジェクト一覧へ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
