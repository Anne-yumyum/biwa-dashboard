export interface WarningItem {
  code: string
  name: string
  level: 'warning' | 'advisory'  // 警報 or 注意報
  area: string
}

const WARNING_CODES: Record<string, { name: string; level: 'warning' | 'advisory' }> = {
  '02': { name: '暴風警報',   level: 'warning'  },
  '03': { name: '暴風雪警報', level: 'warning'  },
  '04': { name: '大雨警報',   level: 'warning'  },
  '05': { name: '洪水警報',   level: 'warning'  },
  '13': { name: '大雪警報',   level: 'warning'  },
  '32': { name: '強風注意報', level: 'advisory' },
  '33': { name: '雷注意報',   level: 'advisory' },
  '35': { name: '大雪注意報', level: 'advisory' },
  '38': { name: '洪水注意報', level: 'advisory' },
  '40': { name: '大雨注意報', level: 'advisory' },
}

// 滋賀県コード 250000
// 対象エリアコード: 250010(大津), 250020(甲賀), 250030(湖北), 250040(湖東), 250050(湖西)
const TARGET_AREAS = ['250010', '250020', '250030', '250040', '250050']

export async function fetchWarnings(): Promise<WarningItem[]> {
  try {
    const url = 'https://www.jma.go.jp/bosai/warning/data/warning/250000.json'
    const res = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []

    const json = await res.json()
    const items: WarningItem[] = []

    for (const areaType of json.areaTypes ?? []) {
      for (const area of areaType.areas ?? []) {
        if (!TARGET_AREAS.includes(area.code)) continue
        for (const w of area.warnings ?? []) {
          if (w.status !== '発表') continue
          const meta = WARNING_CODES[w.code]
          if (!meta) continue
          // 重複除去
          if (!items.find(i => i.code === w.code)) {
            items.push({ code: w.code, name: meta.name, level: meta.level, area: area.name })
          }
        }
      }
    }
    return items
  } catch {
    return []
  }
}
