// Layout espace joueur — accent --color-joueur (orange)
// RBAC guard sera ajouté en Story 1.3
export default function JoueurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--space-accent': 'var(--color-joueur)' } as React.CSSProperties}>
      {children}
    </div>
  )
}
