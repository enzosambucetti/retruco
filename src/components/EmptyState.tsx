interface EmptyStateProps {
  icon: string
  message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-16 px-lg text-center">
      <span className="material-symbols-outlined text-[64px] text-outline-variant">
        {icon}
      </span>
      <p className="text-body-md text-on-surface-variant max-w-xs">{message}</p>
    </div>
  )
}
