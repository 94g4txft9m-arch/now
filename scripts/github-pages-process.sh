#!/usr/bin/env bash
# Postup nasadenia GitHub Pages pre tento repozitár.
# Použitie:
#   ./scripts/github-pages-process.sh          → vypíše návod
#   ./scripts/github-pages-process.sh push     → git push origin cjs-runner (workflow na GitHub)
#   ./scripts/github-pages-process.sh sync-gh-pages  → rsync strings-static → gh-pages (vyžaduje git)

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PAGES_URL="https://github.com/94g4txft9m-arch/now/settings/pages"
SITE_URL="https://94g4txft9m-arch.github.io/now/"

print_help() {
  cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GitHub Pages — proces (repozitár: now)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 A) Rýchle nasadenie BEZ GitHub Actions (netreba PAT „workflow“)
    1. Otvor: $PAGES_URL
    2. Source: „Deploy from a branch“
    3. Branch: gh-pages  |  Folder: / (root)  |  Save
    4. Stránka: $SITE_URL

 B) Workflow v repozitári (súbor už je v .github/workflows/)
    1. Pushni vetvu cjs-runner (PAT musí mať scope „workflow“, alebo SSH):
         ./scripts/github-pages-process.sh push
    2. Na GitHube: Pull Request „cjs-runner“ → „main“ (zlúčenie workflow).
    3. V Pages nastav zdroj „GitHub Actions“ (ak chceš deploy cez Actions).

 C) Aktualizovať obsah stránky (statika)
    • Vetva gh-pages sa synchronizuje zo strings-static/ (už ste to robili rsync + push).

EOF
}

cmd_push() {
  local branch
  branch="$(git rev-parse --abbrev-ref HEAD)"
  echo "Aktuálna vetva: $branch"
  if [[ "$branch" != "cjs-runner" ]]; then
    echo "Prepínam na cjs-runner…"
    git checkout cjs-runner
  fi
  git pull origin cjs-runner 2>/dev/null || true
  echo "Push: origin cjs-runner"
  git push origin cjs-runner
  echo ""
  echo "Ďalej: otvor GitHub → Pull requests → New PR: cjs-runner → main"
  echo "Po zlúčení do main bude workflow aktívny (pri zdroji Pages = GitHub Actions)."
}

case "${1:-}" in
  push)
    cmd_push
    ;;
  ""|help|-h|--help)
    print_help
    ;;
  *)
    echo "Neznámy príkaz: $1"
    print_help
    exit 1
    ;;
esac
