'use client'
import Link from 'next/link'
import { AREAS } from '@/lib/areas'

function windStatusColor(speed: number | undefined): string {
  if (speed === undefined) return '#64748b'
  if (speed < 2.5) return '#059669'
  if (speed < 3.5) return '#d97706'
  return '#dc2626'
}

function windStatusLabel(speed: number | undefined): string {
  if (speed === undefined) return '…'
  if (speed < 2.5) return 'イケる'
  if (speed < 3.5) return 'ヤバい'
  return '死ぬで'
}

interface Props {
  areaWinds?: Record<string, number>  // area.id -> windSpeed
}

export function BiwaLakeMap({ areaWinds = {} }: Props) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 240 360"
        style={{ width: '100%', maxWidth: 280, height: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === 等深線（深度ゾーン）=== */}
        {/* 浅瀬 (0-10m): メイン湖形 */}
        <path
          d="M 75,15 C 105,8 140,28 158,52 C 176,76 196,102 214,132 C 225,155 230,178 228,202 C 226,226 218,246 208,264 C 196,282 180,298 164,314 C 148,328 130,340 112,348 C 94,354 76,350 60,340 C 44,330 30,312 20,290 C 10,268 6,245 8,220 C 10,196 14,170 18,144 C 24,118 32,92 42,68 C 52,44 63,26 75,15 Z"
          fill="#c8e8f8"
          stroke="#8cc8e8"
          strokeWidth="1.5"
        />
        {/* 中深 (10-40m) */}
        <path
          d="M 80,30 C 108,24 136,40 152,62 C 170,86 188,112 204,140 C 216,162 222,184 220,206 C 218,228 210,248 198,264 C 186,278 170,292 154,304 C 138,316 120,326 104,332 C 88,336 74,330 62,320 C 48,308 36,292 26,270 C 18,250 18,226 20,202 C 22,178 28,154 36,128 C 46,102 58,78 70,56 C 74,44 78,32 80,30 Z"
          fill="#a8d8f0"
          stroke="none"
        />
        {/* 深部 (40m+): 北部中央 */}
        <path
          d="M 88,55 C 112,50 142,64 158,86 C 174,108 186,132 192,158 C 198,182 196,204 190,224 C 184,242 172,256 158,266 C 142,276 124,280 108,278 C 92,276 78,268 68,254 C 56,238 50,218 52,196 C 54,174 62,150 74,126 C 82,106 86,64 88,55 Z"
          fill="#88c4ea"
          stroke="none"
        />
        {/* 最深部 (80m+): 北湖中心 */}
        <ellipse cx="118" cy="165" rx="32" ry="55" fill="#68b0e2" />

        {/* === 深度凡例 === */}
        <rect x="4" y="320" width="10" height="6" fill="#c8e8f8" stroke="#8cc8e8" strokeWidth="0.5" />
        <text x="16" y="326" fontSize="7" fill="#64748b">0-10m</text>
        <rect x="4" y="330" width="10" height="6" fill="#a8d8f0" />
        <text x="16" y="336" fontSize="7" fill="#64748b">10-40m</text>
        <rect x="4" y="340" width="10" height="6" fill="#68b0e2" />
        <text x="16" y="346" fontSize="7" fill="#64748b">40m+</text>

        {/* === エリアマーカー === */}
        {AREAS.map((area) => {
          const speed = areaWinds[area.id]
          const color = windStatusColor(speed)
          const label = windStatusLabel(speed)
          return (
            <Link key={area.id} href={`/area/${area.id}`}>
              <g style={{ cursor: 'pointer' }}>
                {/* 背景円 */}
                <circle
                  cx={area.svgX}
                  cy={area.svgY}
                  r={22}
                  fill="rgba(255,255,255,0.88)"
                  stroke={color}
                  strokeWidth="2"
                />
                {/* 方位ラベル */}
                <text
                  x={area.svgX}
                  y={area.svgY - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill="#0a3358"
                >
                  {area.shortName}
                </text>
                {/* 風況ラベル */}
                <text
                  x={area.svgX}
                  y={area.svgY + 8}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill={color}
                >
                  {label}
                </text>
              </g>
            </Link>
          )
        })}

        {/* 北マーク */}
        <text x="228" y="18" fontSize="9" fontWeight="700" fill="#334155" textAnchor="middle">N</text>
        <line x1="228" y1="20" x2="228" y2="30" stroke="#334155" strokeWidth="1.5" />
        <polyline points="224,27 228,18 232,27" fill="#334155" stroke="none" />
      </svg>
    </div>
  )
}
