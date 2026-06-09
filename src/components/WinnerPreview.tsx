interface WinnerPreviewProps {
  pareja1: string
  pareja2: string
  tantos1: number
  tantos2: number
}

export function WinnerPreview({ pareja1, pareja2, tantos1, tantos2 }: WinnerPreviewProps) {
  const winner =
    tantos1 > tantos2 ? pareja1 : tantos2 > tantos1 ? pareja2 : null
  const winnerTantos = tantos1 > tantos2 ? tantos1 : tantos2

  return (
    <div className="rounded-xl bg-secondary-container/30 border border-secondary-container px-md py-sm text-center">
      {winner ? (
        <>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-[2px]">Ganador</p>
          <p className="text-body-md text-on-surface font-semibold">{winner}</p>
          <p className="text-label-sm text-on-surface-variant mt-[2px]">{winnerTantos} tantos</p>
        </>
      ) : (
        <>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-[2px]">Empate</p>
          <p className="text-body-md text-on-surface font-semibold">
            {tantos1} — {tantos2}
          </p>
        </>
      )}
    </div>
  )
}
