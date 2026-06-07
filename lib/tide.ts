import type { TideData, TideEntry, DataResult } from '@/types'

// 敦賀港 調和定数（参考値）
// 参考地点: 福井県敦賀市 北緯35.65° / 東経136.06°（琵琶湖から約45km・最近傍の潮位観測点）
// 日本海側のため日周潮（K1・O1）が卓越。大阪港より近く適切。
// 出典: 海上保安庁水路部 潮汐観測資料（近似値）
const TSURUGA_CONSTITUENTS = [
  { name: 'K1',  amp: 0.182, speed: 15.041069, phase: 278.0 },
  { name: 'O1',  amp: 0.114, speed: 13.943035, phase: 248.0 },
  { name: 'M2',  amp: 0.072, speed: 28.984104, phase: 163.0 },
  { name: 'S2',  amp: 0.030, speed: 30.000000, phase: 192.0 },
  { name: 'N2',  amp: 0.018, speed: 28.439730, phase: 142.0 },
  { name: 'P1',  amp: 0.058, speed: 14.958931, phase: 278.0 },
]

const MEAN_LEVEL = 0.08
const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0)

function tideHeight(tMs: number): number {
  const hoursFromEpoch = (tMs - J2000_MS) / 3_600_000
  let h = MEAN_LEVEL
  for (const c of TSURUGA_CONSTITUENTS) {
    const angleRad = ((c.speed * hoursFromEpoch - c.phase) * Math.PI) / 180
    h += c.amp * Math.cos(angleRad)
  }
  return h
}

function formatHM(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
}

export function calculateTides(date: Date): DataResult<TideData> {
  try {
    const jstOffset = 9 * 60 * 60 * 1000
    const utcMs = date.getTime()
    const jstMs = utcMs + jstOffset
    const jstMidnightMs = Math.floor(jstMs / 86400000) * 86400000
    const startMs = jstMidnightMs - jstOffset

    const endMs = startMs + 24 * 3_600_000
    const STEP = 5 * 60 * 1000

    const heights: { ms: number; h: number }[] = []
    for (let t = startMs; t <= endMs; t += STEP) {
      heights.push({ ms: t, h: tideHeight(t) })
    }

    const entries: TideEntry[] = []
    for (let i = 1; i < heights.length - 1; i++) {
      const prev = heights[i - 1].h
      const cur = heights[i].h
      const next = heights[i + 1].h
      if (cur > prev && cur > next) {
        entries.push({ time: formatHM(new Date(heights[i].ms)), type: 'high', height: Math.round(cur * 100) })
      } else if (cur < prev && cur < next) {
        entries.push({ time: formatHM(new Date(heights[i].ms)), type: 'low', height: Math.round(cur * 100) })
      }
    }

    return {
      success: true,
      data: {
        entries,
        note: '敦賀港参考値',
        updatedAt: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
        }),
      },
    }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
