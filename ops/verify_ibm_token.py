
import os, json, sys
from datetime import datetime
try:
    from qiskit_ibm_runtime import QiskitRuntimeService
except Exception as e:
    print(json.dumps({"ok": False, "error": f"Missing qiskit-ibm-runtime: {e}"})); sys.exit(0)
token = os.getenv("IBM_QUANTUM_TOKEN") or os.getenv("IBM_QUANTUM_API_TOKEN")
if not token:
    print(json.dumps({"ok": False, "error": "Missing IBM_QUANTUM_TOKEN"})); sys.exit(0)
try:
    svc = QiskitRuntimeService(channel="ibm_cloud", token=token, instance=os.getenv("IBM_QUANTUM_INSTANCE") or None)
    _ = svc.backends()
    print(json.dumps({"ok": True, "checked_at": datetime.utcnow().isoformat() + "Z"}))
except Exception as e:
    print(json.dumps({"ok": False, "error": str(e), "checked_at": datetime.utcnow().isoformat() + "Z"}))
