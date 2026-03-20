# Script PowerShell pour nettoyer l’historique Git avec BFG Repo-Cleaner
# Usage :
# 1. Téléchargez bfg.jar depuis https://rtyley.github.io/bfg-repo-cleaner/
# 2. Modifiez le chemin de bfg.jar ci-dessous si besoin
# 3. Exécutez ce script dans PowerShell (en tant qu’administrateur si nécessaire)

$repoUrl = "https://github.com/vianeyMojuye/dream_studio_connect.git"
$bfgPath = "C:\chemin\vers\bfg.jar"  # <-- À adapter !
$fichierCible = "next-swc.win32-x64-msvc.node"

Write-Host "Clonage du dépôt en mode miroir..."
git clone --mirror $repoUrl

$repoName = "dream_studio_connect.git"
Set-Location $repoName

Write-Host "Suppression du fichier volumineux de l’historique avec BFG..."
java -jar $bfgPath --delete-files $fichierCible

Write-Host "Nettoyage et compression du dépôt..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Push forcé vers GitHub (attention, cela réécrit l’historique distant !)..."
git push --force

Write-Host "Nettoyage terminé. Pensez à recloner le dépôt sur vos machines locales."
