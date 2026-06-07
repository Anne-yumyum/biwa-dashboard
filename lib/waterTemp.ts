import type { WaterTemperature, DataResult } from '@/types'

// 国土交通省 水文水質データベース - 琵琶湖表層水温
// 今津観測所 観測点コード: 2308010254090
// http://www1.river.go.jp/ より取得
const STATION_ID = '2308010254090'

function buildMlitUrl(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const dateStr = `${y}${m}${d}`
  return `http://www1.river.go.jp/cgi-bin/DspWaterTemp.exe?KIND=1&ID=${STATION_ID}&BGNDATE=${dateStr}&ENDDATE=${dateStr}&KAWABOU=NO`
}

function parseTemp(html: string): number | null {
  // 水温テーブルから最新値を抽出
  const patterns = [
    /(\d+\.?\d*)\s*℃/,
    /水温[^>]*>\s*([\d.]+)/,
    /<td[^>]*>\s*(1[0-9]|2[0-9]|[5-9])\.\d\s*<\/td>/i,
  ]
  for (const pat of patterns) {
    const m = html.match(pat)
    if (m) {
      const v = parseFloat(m[1])
      if (!isNaN(v) && v > 0 && v < 40) return v
    }
  }
  return null
}

export async function fetchWaterTemp(): Promise<DataResult<WaterTemperature>> {
  try {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const [resToday, resYesterday] = await Promise.all([
      fetch(buildMlitUrl(today), {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'BiwaConditionDashboard/1.0' },
      }),
      fetch(buildMlitUrl(yesterday), {
        next: { revalidate: 7200 },
        headers: { 'User-Agent': 'BiwaConditionDashboard/1.0' },
      }),
    ])

    if (!resToday.ok) throw new Error(`HTTP ${resToday.status}`)
    const htmlToday = await resToday.text()
    const current = parseTemp(htmlToday)

    if (current === null) throw new Error('parse failed')

    let diff: number | null = null
    if (resYesterday.ok) {
      const htmlYesterday = await resYesterday.text()
      const prev = parseTemp(htmlYesterday)
      if (prev !== null) diff = Math.round((current - prev) * 10) / 10
    }

    return {
      success: true,
      data: {
        current,
        diffFromYesterday: diff,
        updatedAt: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Tokyo',
        }),
      },
    }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
