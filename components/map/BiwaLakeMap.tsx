'use client'
import Link from 'next/link'
import { AREAS } from '@/lib/areas'

export function BiwaLakeMap() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 200 380"
        style={{ width: '100%', maxWidth: 240, height: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── 等深線レイヤー (深い順に重ねる) ── */}

        {/* 湖全体 (浅瀬含む) */}
        <path
          d="
            M 68,12
            C 84,6 98,22 112,44
            C 126,64 142,86 156,110
            C 166,130 176,152 180,174
            C 182,192 178,210 166,226
            C 152,242 136,258 118,270
            C 108,278 100,286 96,290
            C 98,302 100,320 96,340
            C 92,356 84,368 76,374
            C 70,378 62,378 56,372
            C 48,364 44,350 44,332
            C 42,314 44,300 46,288
            C 38,280 22,256 14,228
            C 6,202 6,176 8,150
            C 10,126 16,102 22,78
            C 30,56 42,34 58,20
            C 62,14 66,12 68,12
            Z
          "
          fill="#bde4f7"
          stroke="#7ec0e8"
          strokeWidth="1.2"
        />

        {/* 北湖 中深部 (5〜40m) */}
        <path
          d="
            M 70,26
            C 84,20 96,32 108,52
            C 122,72 136,92 148,114
            C 158,134 166,154 168,174
            C 170,190 166,206 156,220
            C 144,234 128,250 112,264
            C 102,272 94,280 90,282
            C 60,274 28,250 16,222
            C 8,198 8,174 10,150
            C 12,128 18,104 26,80
            C 34,58 46,38 60,24
            Z
          "
          fill="#96cff0"
          stroke="none"
        />

        {/* 北湖 深部 (40〜80m) */}
        <ellipse cx="90" cy="152" rx="44" ry="70" fill="#6db8e8" />

        {/* 北湖 最深部 (80m+) */}
        <ellipse cx="88" cy="148" rx="22" ry="38" fill="#4aa2de" />

        {/* 北湖・南湖 ラベル */}
        <text x="112" y="200" fontSize="8" fontWeight="700" fill="#1e5a8a" textAnchor="middle">北湖</text>
        <text x="74" y="335" fontSize="7" fontWeight="700" fill="#1e5a8a" textAnchor="middle">南湖</text>

        {/* 深度凡例 */}
        <rect x="140" y="348" width="8" height="5" fill="#bde4f7" stroke="#7ec0e8" strokeWidth="0.5" />
        <text x="150" y="353" fontSize="6" fill="#64748b">0〜5m</text>
        <rect x="140" y="356" width="8" height="5" fill="#6db8e8" />
        <text x="150" y="361" fontSize="6" fill="#64748b">40m+</text>
        <rect x="140" y="364" width="8" height="5" fill="#4aa2de" />
        <text x="150" y="369" fontSize="6" fill="#64748b">80m+</text>

        {/* ── エリアマーカー ── */}
        {AREAS.map((area) => (
          <Link key={area.id} href={`/area/${area.id}`}>
            <g style={{ cursor: 'pointer' }}>
              <circle
                cx={area.svgX}
                cy={area.svgY}
                r={18}
                fill="rgba(255,255,255,0.90)"
                stroke="#0a3358"
                strokeWidth="1.8"
              />
              <text
                x={area.svgX}
                y={area.svgY - 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#0a3358"
              >
                {area.shortName}
              </text>
              <text
                x={area.svgX}
                y={area.svgY + 9}
                textAnchor="middle"
                fontSize="7"
                fill="#475569"
              >
                タップ
              </text>
            </g>
          </Link>
        ))}

        {/* 北方位マーク */}
        <text x="190" y="14" fontSize="8" fontWeight="700" fill="#475569" textAnchor="middle">N</text>
        <polyline points="186,22 190,12 194,22" fill="none" stroke="#475569" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
