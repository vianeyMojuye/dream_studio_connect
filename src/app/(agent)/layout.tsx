// Layout espace agent — accent --color-agent (bleu)
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--space-accent': 'var(--color-agent)' } as React.CSSProperties}>
      {children}
    </div>
  )
}
