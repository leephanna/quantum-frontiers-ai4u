#!/usr/bin/env bash
set -euo pipefail
echo "🔐 IBM Token Rotation — Project Chimera"
read -s -p "Paste NEW IBM_QUANTUM_TOKEN: " NEWTOKEN
echo
if [[ -z "${NEWTOKEN}" ]]; then echo "No token provided. Aborting." >&2; exit 1; fi
echo "→ Setting GitHub secret IBM_QUANTUM_TOKEN ..."
gh secret set IBM_QUANTUM_TOKEN -b"$NEWTOKEN"
echo "→ Updating Vercel env (production & preview) ..."
vercel env rm IBM_QUANTUM_TOKEN production --yes >/dev/null 2>&1 || true
echo "$NEWTOKEN" | vercel env add IBM_QUANTUM_TOKEN production >/dev/null
vercel env rm IBM_QUANTUM_TOKEN preview --yes >/dev/null 2>&1 || true
echo "$NEWTOKEN" | vercel env add IBM_QUANTUM_TOKEN preview >/dev/null
ROTATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
gh variable set IBM_TOKEN_ROTATED_AT -b"$ROTATED_AT"
echo "✅ Done. Rotated at $ROTATED_AT — remember to revoke the OLD token in IBM."
