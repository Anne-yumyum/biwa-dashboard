import { DetailHeader } from '@/components/layout/DetailHeader'

const GSI_URL = 'https://maps.gsi.go.jp/index_m.html#11/35.299716/136.118774/&base=std&ls=std%7Clake1&blend=0&disp=11&vs=c1g1j0h0k0l0u0t0z0r0s0m0f0'

export default function DepthDetailPage() {
  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="琵琶湖 等深線" />

      <main className="flex-1 flex flex-col min-h-0">
        {/* 地理院地図（湖沼図レイヤー）埋め込み */}
        <iframe
          src={GSI_URL}
          title="琵琶湖 湖沼図（等深線）"
          style={{ flex: 1, width: '100%', border: 'none', minHeight: 0 }}
          allow="geolocation"
        />

        {/* フッター: 外部リンク + 出典 */}
        <div style={{
          padding: '8px 12px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          borderTop: '1px solid #c8dde8',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}>
          <p style={{ fontSize: 10, color: '#64748b' }}>
            出典: 国土地理院 地理院地図（湖沼図）
          </p>
          <a
            href={GSI_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              background: '#0a3358',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            別画面で開く ↗
          </a>
        </div>
      </main>
    </div>
  )
}
