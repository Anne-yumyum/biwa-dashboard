export interface Area {
  id: string
  name: string
  shortName: string
  lat: number
  lon: number
  svgX: number
  svgY: number
}

export const AREAS: Area[] = [
  { id: 'north', name: '北（海津）',  shortName: '北', lat: 35.52, lon: 135.96, svgX: 62,  svgY: 30  },
  { id: 'west',  name: '西（高島）',  shortName: '西', lat: 35.35, lon: 135.87, svgX: 35,  svgY: 135 },
  { id: 'east',  name: '東（彦根）',  shortName: '東', lat: 35.27, lon: 136.26, svgX: 155, svgY: 178 },
  { id: 'south', name: '南（沖島）',  shortName: '南', lat: 35.17, lon: 136.07, svgX: 98,  svgY: 245 },
]

export function getArea(id: string): Area | undefined {
  return AREAS.find(a => a.id === id)
}
