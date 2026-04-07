#!/usr/bin/env bash
# Postup nasadenia GitHub Pages pre tento repozitár.
# Použitie:
#   ./scripts/github-pages-process.sh              → vypíše návod
#   ./scripts/github-pages-process.sh push         → git push origin cjs-runner
#   ./scripts/github-pages-process.sh sync-gh-pages → rsync strings-static → vetva gh-pages + push

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

 B) GitHub Actions workflow (voliteľné)
    • Šablóna je v docs/deploy-strings-static-pages.yml — skopíruj do .github/workflows/
      (push vyžaduje PAT s „workflow“ alebo SSH).
    • Alebo: ./scripts/github-pages-process.sh push  (vetva cjs-runner), potom PR do main.

 C) Aktualizovať obsah stránky (statika) — odporúčané
    ./scripts/github-pages-process.sh sync-gh-pages

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

cmd_sync_gh_pages() {
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    echo "Pracovný strom nie je čistý — commitni alebo stashni zmeny pred sync-gh-pages."
    exit 1
  fi
  local prev
  prev="$(git rev-parse --abbrev-ref HEAD)"
  _GH_SYNC_TMP="$(mktemp -d)"
  trap 'rm -rf "$_GH_SYNC_TMP"' EXIT
  echo "Export strings-static z vetvy $prev (git archive) → dočasný priečinok"
  git archive "$prev" strings-static | tar -x -C "$_GH_SYNC_TMP"
  echo "Synchronizácia → vetva gh-pages (potom návrat na: $prev)"
  git fetch origin gh-pages
  if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
  else
    git checkout -b gh-pages origin/gh-pages
  fi
  git pull --ff-only origin gh-pages 2>/dev/null || true
  rsync -a --delete \
    --exclude='.git/' \
    "${_GH_SYNC_TMP}/strings-static/" "${ROOT}/"
  git add -A
  if git diff --staged --quiet; then
    echo "Žiadne zmeny oproti aktuálnemu gh-pages."
  else
    git commit -m "Sync strings-static → GitHub Pages"
  fi
  git push origin gh-pages
  git checkout "$prev"
  echo "Hotovo. Stránka: $SITE_URL"
}

case "${1:-}" in
  push)
    cmd_push
    ;;
  sync-gh-pages)
    cmd_sync_gh_pages
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
