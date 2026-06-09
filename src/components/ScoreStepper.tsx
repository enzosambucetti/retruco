interface ScoreStepperProps {
  label: string
  value: number
  onChange: (v: number) => void
}

export function ScoreStepper({ label, value, onChange }: ScoreStepperProps) {
  return (
    <div className="flex flex-col items-center gap-xs">
      <span className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide text-center">
        {label}
      </span>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Restar tanto a ${label}`}
          className="w-12 h-14 flex items-center justify-center bg-surface-container rounded-l-xl text-on-surface text-[24px] active:scale-90 transition-transform select-none"
        >
          −
        </button>
        <div className="w-16 h-14 flex items-center justify-center bg-surface-container-low text-ranking-number font-bold text-on-surface select-none">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Sumar tanto a ${label}`}
          className="w-12 h-14 flex items-center justify-center bg-surface-container rounded-r-xl text-on-surface text-[24px] active:scale-90 transition-transform select-none"
        >
          +
        </button>
      </div>
    </div>
  )
}
