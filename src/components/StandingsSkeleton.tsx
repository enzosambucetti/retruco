export function StandingsSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-9 bg-surface-container-high rounded mb-2" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-11 bg-surface-container-low rounded mb-1"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  )
}
