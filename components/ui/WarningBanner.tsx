import { fetchWarnings } from '@/lib/warning'

export async function WarningBanner() {
  const warnings = await fetchWarnings()
  if (warnings.length === 0) return null

  const hasWarning = warnings.some(w => w.level === 'warning')
  const bg = hasWarning ? '#7f1d1d' : '#78350f'
  const border = hasWarning ? '#dc2626' : '#d97706'

  return (
    <div style={{
      background: bg,
      borderBottom: `2px solid ${border}`,
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 16 }}>{hasWarning ? '🚨' : '⚠️'}</span>
      <div style={{ flex: 1 }}>
        {warnings.map((w, i) => (
          <span key={i} style={{
            fontSize: 11,
            fontWeight: 700,
            color: hasWarning ? '#fca5a5' : '#fcd34d',
            marginRight: 8,
          }}>
            {w.name}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 9, color: '#9ca3af' }}>気象庁</span>
    </div>
  )
}
