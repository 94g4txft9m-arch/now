#!/usr/bin/env bash
# Jednorazovo: po každom commite automatický push na origin (aktuálna vetva).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
git config core.hooksPath .githooks
chmod +x .githooks/post-commit
echo "Nastavené: core.hooksPath=.githooks — po commite sa spustí push na origin (ak zlyhá, zobrazí sa hláška)."
