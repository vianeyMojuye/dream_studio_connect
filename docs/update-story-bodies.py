#!/usr/bin/env python3
"""
- Met la description Epic dans le milestone GitHub correspondant
- Retire l'entete Epic du body de chaque story issue (garde uniquement la story)
"""

import re
import subprocess

EPICS_FILE = "_bmad-output/planning-artifacts/epics.md"
REPO = "vianeyMojuye/dream_studio_connect"

# Milestone GitHub number = epic number (1-8)
EPIC_MILESTONE = {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8}

# Story ID -> GitHub issue number (sequential)
STORY_TO_ISSUE = {}
counter = 1
EPIC_STORIES = {
    1: ["1.1","1.2","1.3","1.4","1.5","1.6"],
    2: ["2.1","2.2","2.3","2.4"],
    3: ["3.1","3.2","3.3","3.4","3.5"],
    4: ["4.1","4.2","4.3","4.4"],
    5: ["5.1","5.2","5.3"],
    6: ["6.1","6.2","6.3","6.4"],
    7: ["7.1","7.2","7.3"],
    8: ["8.1","8.2","8.3"],
}
for epic_num, stories in EPIC_STORIES.items():
    for sid in stories:
        STORY_TO_ISSUE[sid] = counter
        counter += 1

with open(EPICS_FILE, encoding="utf-8") as f:
    content = f.read()

# --- Extract epic descriptions ---
epic_desc_pattern = re.compile(r"^### Epic (\d+) : (.+?)$", re.MULTILINE)
epic_matches = list(epic_desc_pattern.finditer(content))

epic_descriptions = {}
for i, m in enumerate(epic_matches):
    epic_num = int(m.group(1))
    epic_title = m.group(2).strip()
    start = m.end()
    end = epic_matches[i + 1].start() if i + 1 < len(epic_matches) else len(content)
    block = content[start:end]
    pre_story = re.split(r"\n### Story ", block)[0].strip()
    epic_descriptions[epic_num] = (epic_title, pre_story)

# --- Extract story blocks ---
story_pattern = re.compile(r"^### Story (\d+\.\d+) : (.+?)$", re.MULTILINE)
story_matches = list(story_pattern.finditer(content))

stories = {}
for i, m in enumerate(story_matches):
    story_id = m.group(1)
    start = m.start()
    end = story_matches[i + 1].start() if i + 1 < len(story_matches) else len(content)
    block = content[start:end].strip()
    stories[story_id] = block

# =========================================================
# 1. Mettre la description Epic dans chaque milestone
# =========================================================
print("[MILESTONES] Mise a jour des descriptions Epic...\n")
for epic_num, (epic_title, epic_desc) in epic_descriptions.items():
    ms_num = EPIC_MILESTONE[epic_num]
    print(f"  [UPDATE] Milestone #{ms_num} (Epic {epic_num})...", end=" ", flush=True)
    result = subprocess.run(
        ["gh", "api", f"repos/{REPO}/milestones/{ms_num}",
         "--method", "PATCH",
         "-f", f"description={epic_desc}"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print("OK")
    else:
        print(f"ERREUR\n     {result.stderr.strip()}")

# =========================================================
# 2. Mettre a jour le body des story issues (story seule, sans entete epic)
# =========================================================
print(f"\n[STORIES] Mise a jour des {len(stories)} story issues (body = story uniquement)...\n")
for story_id, story_body in stories.items():
    issue_num = STORY_TO_ISSUE.get(story_id)
    if not issue_num:
        print(f"  [WARN] Story {story_id} : pas de mapping trouve")
        continue

    print(f"  [UPDATE] Issue #{issue_num} (Story {story_id})...", end=" ", flush=True)
    result = subprocess.run(
        ["gh", "issue", "edit", str(issue_num), "--repo", REPO, "--body", story_body],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print("OK")
    else:
        print(f"ERREUR\n     {result.stderr.strip()}")

print("\n[DONE] Termine.")
