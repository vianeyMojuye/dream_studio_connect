import { NextResponse } from 'next/server'

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Formulaire de consentement parental</title>
<style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.6}h1{color:#1a1a1a}table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:8px;border-bottom:1px solid #eee}.signature{margin-top:40px;border-top:1px solid #999;padding-top:20px}</style>
</head>
<body>
<h1>Formulaire de consentement parental</h1>
<p><strong>Dream Studio Connect</strong> — Plateforme de mise en relation talent/agent</p>
<p>En tant que représentant légal de l'enfant ci-dessous, j'autorise la création d'un compte sur la plateforme Dream Studio Connect.</p>
<table>
  <tr><td><strong>Nom de l'enfant :</strong></td><td>___________________________</td></tr>
  <tr><td><strong>Date de naissance :</strong></td><td>___________________________</td></tr>
  <tr><td><strong>Nom du représentant légal :</strong></td><td>___________________________</td></tr>
  <tr><td><strong>Lien de parenté :</strong></td><td>___________________________</td></tr>
  <tr><td><strong>Email du représentant :</strong></td><td>___________________________</td></tr>
</table>
<p>Je certifie avoir lu et accepté les <a href="/conditions-utilisation">Conditions Générales d'Utilisation</a> et la <a href="/politique-confidentialite">Politique de confidentialité</a> au nom de l'enfant mineur.</p>
<p>Le profil du mineur restera non-public tant que ce formulaire n'aura pas été validé par l'équipe Dream Studio Connect.</p>
<div class="signature">
  <p>Date : ___________________________</p>
  <p>Signature du représentant légal :</p>
  <br><br><br>
  <p>___________________________</p>
</div>
<p><em>Ce formulaire doit être envoyé à : support@dreamstudioconnect.com</em></p>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="consentement-parental.html"',
    },
  })
}
