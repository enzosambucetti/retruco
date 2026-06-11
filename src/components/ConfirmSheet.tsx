import { useEffect, useRef } from 'react'

interface ConfirmSheetProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => cancelRef.current?.focus(), 50)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full bg-surface-container-lowest rounded-t-2xl px-lg pt-lg pb-[max(2rem,env(safe-area-inset-bottom))] shadow-xl max-w-lg mx-auto animate-[slideUp_200ms_ease-out]">
        <h2 className="font-condensed text-headline-md text-on-surface mb-xs">
          {title}
        </h2>
        <p className="text-body-md text-on-surface-variant mb-lg whitespace-pre-line">{description}</p>
        <div className="flex gap-sm">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 h-12 rounded-full border border-outline text-on-surface text-label-sm font-semibold active:scale-95 transition-transform"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-12 rounded-full text-white text-label-sm font-semibold active:scale-95 transition-transform ${
              destructive ? 'bg-error' : 'bg-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
