export function SeriesCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-surface-container-low animate-pulse">
      <div className="h-32 bg-surface-container-highest" />
      <div className="p-md space-y-sm">
        <div className="h-5 bg-surface-container-highest rounded w-3/4" />
        <div className="h-4 bg-surface-container-high rounded w-1/2" />
        <div className="h-4 bg-surface-container-high rounded w-2/3" />
        <div className="h-10 bg-surface-container-highest rounded-full mt-md" />
      </div>
    </div>
  )
}
