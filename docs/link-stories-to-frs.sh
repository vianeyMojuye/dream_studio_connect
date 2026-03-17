#!/bin/bash

export PATH="$PATH:/c/Program Files/GitHub CLI:/c/Program Files/Git/bin:/c/Program Files/Git/cmd"

REPO="vianeyMojuye/dream_studio_connect"

echo "🗑  Fermeture des issues dupliquées (#68 → #102)..."
for i in $(seq 68 102); do
  gh issue close $i --repo "$REPO" --comment "Doublon — FR déjà importée en #$(( i - 35 ))." 2>/dev/null
  echo "  ✓ Fermée : #$i"
done

echo ""
echo "🔗 Ajout des liens Stories → Features (FRs)..."

add_fr_links() {
  local STORY_ISSUE=$1
  local FR_ISSUES=$2
  local REFS=""
  for fr in $FR_ISSUES; do
    REFS="${REFS} #${fr}"
  done
  gh issue comment $STORY_ISSUE --repo "$REPO" \
    --body "**Features couvertes par cette story :**
${REFS}

> Liens automatiques générés depuis le fichier \`epics.md\` BMAD."
  echo "  ✓ Story #${STORY_ISSUE} → FRs :${REFS}"
}

# Epic 1 — Stories #1–6 → FRs #33–39 (FR01–FR07)
for s in 1 2 3 4 5 6; do
  add_fr_links $s "33 34 35 36 37 38 39"
done

# Epic 2 — Stories #7–10 → FRs #40–45 (FR08–FR13)
for s in 7 8 9 10; do
  add_fr_links $s "40 41 42 43 44 45"
done

# Epic 3 — Stories #11–15 → FRs #46–49,51–53 (FR14–17,FR19–21)
for s in 11 12 13 14 15; do
  add_fr_links $s "46 47 48 49 51 52 53"
done

# Epic 4 — Stories #16–19 → FRs #38,61–64 (FR06,FR29–32)
for s in 16 17 18 19; do
  add_fr_links $s "38 61 62 63 64"
done

# Epic 5 — Stories #20–22 → FRs #65–67 (FR33–35)
for s in 20 21 22; do
  add_fr_links $s "65 66 67"
done

# Epic 6 — Stories #23–26 → FRs #54–58 (FR22–26)
for s in 23 24 25 26; do
  add_fr_links $s "54 55 56 57 58"
done

# Epic 7 — Stories #27–29 → pas de FRs (NFRs only)
echo "  ℹ Epic 7 (#27–#29) : couverture NFR uniquement, pas de liaison FR."

# Epic 8 — Stories #30–32 → FRs #50,59–60 (FR18,FR27–28)
for s in 30 31 32; do
  add_fr_links $s "50 59 60"
done

echo ""
echo "🎉 Liaisons Stories ↔ Features terminées."
