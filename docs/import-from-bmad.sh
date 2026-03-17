#!/bin/bash

FILE="../epics.md"

if [ ! -f "$FILE" ]; then
  echo "❌ Le fichier epics.md est introuvable."
  exit 1
fi

CURRENT_EPIC=""
CURRENT_EPIC_NUMBER=""

echo "🚀 Import automatique BMAD → GitHub démarre..."

while IFS= read -r line; do

  # Detect EPIC
  if [[ "$line" =~ ^###\ Epic\ ([0-9]+)\ :\ (.*)$ ]]; then
    CURRENT_EPIC_NUMBER="${BASH_REMATCH[1]}"
    CURRENT_EPIC="${BASH_REMATCH[2]}"
    MILESTONE="Epic ${CURRENT_EPIC_NUMBER} – ${CURRENT_EPIC}"
    echo "📌 Création Milestone : $MILESTONE"
    gh milestone create "$MILESTONE" 2>/dev/null
    continue
  fi

  # Detect STORY
  if [[ "$line" =~ ^###\ Story\ ([0-9]+\.[0-9]+)\ :\ (.*)$ ]]; then
    STORY_ID="${BASH_REMATCH[1]}"
    STORY_TITLE="${BASH_REMATCH[2]}"

    echo "  ➕ Story créée : $STORY_TITLE"

    gh issue create \
      --title "Story $STORY_ID : $STORY_TITLE" \
      --label "story" \
      --milestone "Epic ${CURRENT_EPIC_NUMBER} – ${CURRENT_EPIC}" \
      --body "Story importée automatiquement depuis BMAD (epics.md).\n\nAffectée à l'Epic : ${CURRENT_EPIC}"
    continue
  fi

done < "$FILE"

echo "✔ Import Stories terminé."

# Import FRs
echo "📘 Import des FRs ..."
grep "^FR[0-9]\+" -n "$FILE" | while IFS= read -r line; do
  FULL_LINE=$(echo "$line" | cut -d: -f2-)
  FR_ID=$(echo "$FULL_LINE" | sed -E 's/(FR[0-9]+).*/\1/')
  FR_TITLE=$(echo "$FULL_LINE" | sed -E 's/FR[0-9]+ *: *//')

  echo "  ➕ Feature $FR_ID : $FR_TITLE"

  gh issue create \
    --title "$FR_ID : $FR_TITLE" \
    --label "feature" \
    --body "Feature importée automatiquement depuis BMAD (FR Section)."
done

echo "🎉 Import complet terminé."
