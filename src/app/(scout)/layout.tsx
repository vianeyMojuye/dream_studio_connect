// Layout espace scout — accent --color-scout (ambre)
export default function ScoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--space-accent': 'var(--color-scout)' } as React.CSSProperties}>
      {children}
    </div>
  )
}
