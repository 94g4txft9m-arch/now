#!/usr/bin/env bash
# Voliteľné systémové nástroje (macOS + Homebrew): GitHub CLI, Blender.
# Spustenie: ./scripts/install-macos-extras.sh
set -euo pipefail
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew nie je v PATH. Nainštaluj z https://brew.sh a spusti znova."
  exit 1
fi
brew install gh
brew install --cask blender
echo "Hotovo: gh, Blender."
