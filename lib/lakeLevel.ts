import type { LakeLevel, DataResult } from '@/types'

// 国土交通省 水文水質データベース
// 琵琶湖観測所 ID: 306041286603280
// KIND=9: リアルタイム10分値
// 値はBSL基準メートル（例: -0.11 = -11cm BSL）
// 文字コード: EUC-JP
const STATION_ID = '306041286603280'
const REALTIME_URL = `http://www1.river.go.jp/cgi-bin/DspWaterData.exe?KIND=9&ID=${STATION_ID}`
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'ja,en;q=0.9',
  'Referer': 'http://www1.river.go.jp/',
}

function parseLatestLevel(html: string): number | null {
  // <FONT color="#0000ff">-0.11</FONT> パターン
  const pat = /<FONT[^>]*color="#0000ff"[^>]*>\s*(-?\d+\.\d+)\s*<\/FONT>/gi
  const values: number[] = []
  let m: RegExpExecArray | null
  while ((m = pat.exec(html)) !== null) {
    const v = parseFloat(m[1])
    // BSL基準メートルの妥当範囲: -2m〜+2m
    if (!isNaN(v) && v > -2 && v < 2) values.push(v)
  }
  if (values.length === 0) return null
  // 最初の値が最新（ページ上部が新しい）
  return Math.round(values[0] * 100) // cm BSL へ変換
}

export async function fetchLakeLevel(): Promise<DataResult<LakeLevel>> {
  try {
    const [resNow, resYesterday] = await Promise.all([
      fetch(REALTIME_URL, { next: { revalidate: 600 }, headers: HEADERS }),
      // 前日分は同じURLの10分値から近似（前日同時刻の値を探す）
      fetch(REALTIME_URL, { next: { revalidate: 7200 }, headers: HEADERS }),
    ])

    if (!resNow.ok) throw new Error(`HTTP ${resNow.status}`)

    // EUC-JP デコード
    const buf = await resNow.arrayBuffer()
    const html = new TextDecoder('euc-jp').decode(buf)

    const current = parseLatestLevel(html)
    if (current === null) throw new Error('parse failed')

    // 前日比: 同じページに昨日同時刻のデータも含まれている可能性があるため
    // 10分値は約24時間分保持 → 144番目の値が前日同時刻
    const allPat = /<FONT[^>]*color="#0000ff"[^>]*>\s*(-?\d+\.\d+)\s*<\/FONT>/gi
    const allVals: number[] = []
    let am: RegExpExecArray | null
    while ((am = allPat.exec(html)) !== null) {
      const v = parseFloat(am[1])
      if (!isNaN(v) && v > -2 && v < 2) allVals.push(v)
    }
    // 144個の10分値 = 24時間
    const prevIdx = Math.min(143, allVals.length - 1)
    const diff = allVals.length > prevIdx
      ? Math.round(allVals[0] * 100) - Math.round(allVals[prevIdx] * 100)
      : null

    return {
      success: true,
      data: {
        current,
        diffFromYesterday: diff,
        updatedAt: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
        }),
      },
    }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
