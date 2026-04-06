#!/bin/bash
# ============================================================
# Claude Project Starter - Machine Setup Script
# ============================================================
# Run this ONCE on each new machine to install the designer
# plugins from the marketplace. Skills and commands are already
# in the repo (.claude/skills/ and .claude/commands/), but
# plugins need to be installed per-machine.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================================

set -e

echo "Setting up Claude Code designer plugins..."
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "ERROR: Claude Code CLI not found."
    echo "Install it first: https://docs.anthropic.com/en/docs/claude-code"
    exit 1
fi

echo "Step 1: Adding designer-skills marketplace..."
claude /plugin marketplace add Owl-Listener/designer-skills

echo ""
echo "Step 2: Installing all 8 designer plugins..."

PLUGINS=(
    "design-research"
    "design-systems"
    "ux-strategy"
    "ui-design"
    "interaction-design"
    "prototyping-testing"
    "design-ops"
    "designer-toolkit"
)

for plugin in "${PLUGINS[@]}"; do
    echo "  Installing: $plugin"
    claude /plugin install "$plugin@designer-skills" 2>/dev/null || echo "  (may need manual install via /plugin)"
done

echo ""
echo "Setup complete!"
echo ""
echo "All 63 skills and 27 commands are ready."
echo "Skills are also bundled in .claude/skills/ (works without plugin install)."
echo ""
echo "Try a command:  /design-research--discover"
echo "                /ui-design--design-screen"
echo "                /design-systems--audit-system"
