interface ScoreStepperProps {
  label: string
  value: number
  onChange: (v: number) => void
  max?: number
}

export function ScoreStepper({ label, value, onChange, max = 40 }: ScoreStepperProps) {
  const error = value > max

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(raw === '' ? 0 : parseInt(raw, 10))
  }

  return (
    <div className="flex flex-col items-center gap-xs">
      <span className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide text-center line-clamp-1">
        {label}
      </span>
      <div className="flex items-center self-end">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Restar tanto a ${label}`}
          className="w-12 h-14 flex items-center justify-center bg-surface-container rounded-l-xl text-on-surface text-[24px] active:scale-90 transition-transform select-none"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInput}
          onFocus={(e) => e.target.select()}
          aria-label={`Tantos de ${label}`}
          className={`w-16 h-14 text-center bg-surface-container-low text-ranking-number font-bold outline-none border-y-2 ${
            error ? 'border-error text-error' : 'border-transparent text-on-surface'
          }`}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Sumar tanto a ${label}`}
          className="w-12 h-14 flex items-center justify-center bg-surface-container rounded-r-xl text-on-surface text-[24px] active:scale-90 transition-transform select-none"
        >
          +
        </button>
      </div>
      {error && <span className="text-label-sm text-error">Máximo {max} tantos</span>}
    </div>
  )
}
