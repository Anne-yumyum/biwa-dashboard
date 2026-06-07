import { fetchWaterTemp } from '@/lib/waterTemp'
import { CardError } from '@/components/ui/CardSkeleton'

export async function WaterTempCard() {
  const result = await fetchWaterTemp()

  if (!result.success) {
    return (
      <div className="card">
        <p className="card-label">🌡️ 琵琶湖水温</p>
        <p className="text-slate-400 text-sm mt-2">データなし</p>
      </div>
    )
  }

  const { current, diffFromYesterday } = result.data
  const diffColor = diffFromYesterday === null
    ? ''
    : diffFromYesterday > 0
      ? 'text-red-500'
      : diffFromYesterday < 0
        ? 'text-sky-500'
        : 'text-slate-500'

  return (
    <div className="card">
      <p className="card-label">🌡️ 琵琶湖水温</p>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p className="data-label">現在</p>
          <p className="data-value">{current}<span className="data-unit">℃</span></p>
        </div>
        {diffFromYesterday !== null && (
          <div>
            <p className="data-label">前日比</p>
            <p className={`data-value ${diffColor}`}>
              {diffFromYesterday >= 0 ? '+' : ''}{diffFromYesterday}<span className="data-unit">℃</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
