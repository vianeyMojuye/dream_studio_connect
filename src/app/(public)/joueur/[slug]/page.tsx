// Profil public joueur — stub ISR (complété Story 2.3)
export default function PublicPlayerProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Profil joueur : {params.slug}</h1>
      <p className="text-muted-foreground">Page en cours de construction</p>
    </div>
  )
}
