import type { DataResult } from '@/types'

export interface Discharge {
  current: number // m³/s
  updatedAt: string
}

// 国土交通省 琵琶湖河川事務所 - 瀬田川洗堰放流量
// https://www.kkr.mlit.go.jp/biwako/suimon/
const DATA_URL = 'https://www.kkr.mlit.go.jp/biwako/suimon/'

const BROWSER_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

function parseDischarge(html: string): number | null {
  // 「放流量」の後に続く数値（m³/s）を抽出
  const patterns = [
    /放流量[^>]*?>[\s\S]*?([\d,]+\.?\d*)\s*(?:m3\/s|㎥\/s|m³\/s)/i,
    /放流[^>]*>([\d,.]+)\s*(?:m3|㎥|m³)/i,
    /洗堰[^\d]*([\d,]+\.?\d*)/,
    // 一般的な数値パターン（放流量前後）
    /放流量.*?(\d+\.?\d*)/s,
  ]
  for (const pat of patterns) {
    const m = html.match(pat)
    if (m) {
      const v = parseFloat(m[1].replace(',', ''))
      if (!isNaN(v) && v >= 0 && v < 2000) return v
    }
  }
  return null
}

export async function fetchDischarge(): Promise<DataResult<Discharge>> {
  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': BROWSER_UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()
    const current = parseDischarge(html)
    if (current === null) throw new Error('parse failed')

    return {
      success: true,
      data: {
        current,
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
