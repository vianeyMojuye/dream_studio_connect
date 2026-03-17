#!/bin/bash

export PATH="$PATH:/c/Program Files/GitHub CLI:/c/Program Files/Git/bin:/c/Program Files/Git/cmd"

REPO="vianeyMojuye/dream_studio_connect"

# assign_milestone ISSUE_NUMBER MILESTONE_NUMBER
assign() {
  local ISSUE=$1
  local MS=$2
  gh api repos/$REPO/issues/$ISSUE \
    --method PATCH \
    -F milestone=$MS \
    --silent
  echo "  ✓ FR #$ISSUE → Milestone Epic $MS"
}

echo "🔗 Association FRs → Epics (milestones)..."

# Epic 1 (milestone 1) : FR01–FR07 → issues #33–#39
for i in 33 34 35 36 37 38 39; do assign $i 1; done

# Epic 2 (milestone 2) : FR08–FR13 → issues #40–#45
for i in 40 41 42 43 44 45; do assign $i 2; done

# Epic 3 (milestone 3) : FR14–FR17, FR19–FR21 → issues #46–#49, #51–#53
for i in 46 47 48 49 51 52 53; do assign $i 3; done

# FR18 (#50) → Epic 8 (milestone 8)
assign 50 8

# Epic 6 (milestone 6) : FR22–FR26 → issues #54–#58
for i in 54 55 56 57 58; do assign $i 6; done

# Epic 8 (milestone 8) : FR27–FR28 → issues #59–#60
for i in 59 60; do assign $i 8; done

# Epic 4 (milestone 4) : FR29–FR32 → issues #61–#64
# FR06 (#38) aussi dans Epic 4 (déjà assigné Epic 1 — on ajoute un commentaire)
for i in 61 62 63 64; do assign $i 4; done

# Epic 5 (milestone 5) : FR33–FR35 → issues #65–#67
for i in 65 66 67; do assign $i 5; done

# FR06 couvre Epic 1 ET Epic 4 — on ajoute un commentaire explicatif
gh issue comment 38 --repo "$REPO" \
  --body "⚠️ **FR multi-epic** : cette feature est couverte par **Epic 1** (inscription) et **Epic 4** (admin back-office). Milestone principal : Epic 1."

echo ""
echo "🎉 Association FRs → Epics terminée."
