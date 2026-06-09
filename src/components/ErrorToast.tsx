import { useEffect, useState } from 'react'

interface ErrorToastProps {
  message: string
  onRetry?: () => void
}

export function ErrorToast({ message, onRetry }: ErrorToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      role="alert"
      className="fixed left-4 right-4 bottom-20 z-50 bg-on-surface text-surface rounded-lg px-md py-sm flex items-center justify-between gap-sm shadow-lg"
    >
      <p className="text-body-md flex-1">{message}</p>
      <div className="flex items-center gap-xs shrink-0">
        {onRetry && (
          <button
            onClick={() => {
              onRetry()
              setVisible(false)
            }}
            className="text-label-sm font-semibold text-primary-container active:scale-95 transition-transform"
          >
            Reintentar
          </button>
        )}
        <button
          onClick={() => setVisible(false)}
          className="text-label-sm font-semibold text-outline active:scale-95 transition-transform"
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  )
}
