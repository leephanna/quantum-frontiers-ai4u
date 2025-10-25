
# Ops: Token Rotation
1) Create a **new** token in IBM Quantum dashboard.
2) Run `./ops/rotate_ibm_token.sh`
3) Revoke the old token.
4) (Optional) Run `python ops/verify_ibm_token.py`

Prereqs: gh CLI, vercel CLI, Python (for verify).
