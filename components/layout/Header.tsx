import { RefreshButton } from '@/components/ui/RefreshTimer'

interface HeaderProps {
  updatedAt: string
}

export function Header({ updatedAt }: HeaderProps) {
  return (
    <header
      className="pt-safe"
      style={{
        background: '#0a3358',
        borderBottom: '1px solid rgba(100,160,220,0.3)',
        padding: '0 12px 8px',
      }}
    >
      <div className="flex items-center justify-between" style={{ paddingTop: 10 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 800, color: '#e0eaf2', lineHeight: 1, letterSpacing: '-0.01em' }}>
            ビワマスナビ
          </h1>
          <p style={{ fontSize: 10, color: '#3d6880', marginTop: 2, letterSpacing: '0.04em' }}>
            出船前コンディションチェック
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p style={{ fontSize: 9, color: '#3d6880', lineHeight: 1 }}>最終更新</p>
            <p style={{ fontSize: 13, color: '#7ec8f8', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1.2 }}>
              {updatedAt}
            </p>
          </div>
          <RefreshButton />
        </div>
      </div>
    </header>
  )
}
