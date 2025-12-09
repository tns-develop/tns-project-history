/**
 * プロジェクト一覧のローディング状態を表示するコンポーネント
 * - Suspenseのフォールバックとして使用
 * - スケルトンローディングUIを提供
 */
export function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-lg bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  )
}