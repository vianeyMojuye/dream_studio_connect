// Layout espace admin — accent --color-admin (violet)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--space-accent': 'var(--color-admin)' } as React.CSSProperties}>
      {children}
    </div>
  )
}
