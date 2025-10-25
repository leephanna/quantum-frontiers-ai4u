import os, json, argparse
from datetime import datetime
from qiskit import QuantumCircuit
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler, Options

BELL_QASM = r"""
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;
"""

def to_counts_from_quasi(quasi, shots):
    counts = {}
    for bitstring, prob in quasi.items():
        try:
            p = float(prob)
        except Exception:
            p = 0.0
        counts[bitstring] = int(round(p * shots))
    total = sum(counts.values())
    if total != shots and counts:
        key = max(counts, key=counts.get)
        counts[key] += (shots - total)
    return counts

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", default="ibmq_qasm_simulator")
    ap.add_argument("--shots", type=int, default=1024)
    ap.add_argument("--qasm_file", type=str, default=None)
    ap.add_argument("--qasm", type=str, default=None, help="OpenQASM 2 string")
    ap.add_argument("--use-sampler", action="store_true", help="Use Qiskit Runtime Sampler (recommended)")
    args = ap.parse_args()

    qasm_str = args.qasm or BELL_QASM
    if args.qasm_file:
        try:
            with open(args.qasm_file, "r", encoding="utf-8") as f:
                qasm_str = f.read()
        except Exception as e:
            print(json.dumps({"error": f"Failed to read qasm_file: {e}"}))
            return

    token = os.getenv("IBM_QUANTUM_API_TOKEN")
    if not token:
        print(json.dumps({"error": "Missing IBM_QUANTUM_API_TOKEN"}))
        return

    hub = os.getenv("IBM_QUANTUM_HUB") or None
    group = os.getenv("IBM_QUANTUM_GROUP") or None
    project = os.getenv("IBM_QUANTUM_PROJECT") or None
    instance = "/".join([x for x in [hub, group, project] if x])

    service = QiskitRuntimeService(channel="ibm_quantum", token=token, instance=instance if instance else None)

    qc = QuantumCircuit.from_qasm_str(qasm_str)

    payload = {
        "backend": args.backend,
        "shots": args.shots,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "status": "submitted",
    }

    try:
        if args.use_sampler:
            opts = Options()
            if args.backend:
                opts.execution = {"backend": args.backend}
            sampler = Sampler(session=None, service=service, options=opts)
            job = sampler.run([qc], shots=args.shots)
            payload["job_id"] = job.job_id()
            result = job.result()
            quasi = result.quasi_dists[0] if hasattr(result, "quasi_dists") else result[0]
            payload["quasi_probs"] = {str(k): float(v) for k, v in quasi.items()}
            payload["counts"] = to_counts_from_quasi(payload["quasi_probs"], args.shots)
            payload["status"] = "completed"
        else:
            payload["error"] = "Only --use-sampler path is supported in this runner."
    except Exception as e:
        payload["status"] = "failed"
        payload["error"] = str(e)

    print(json.dumps(payload))

if __name__ == "__main__":
    main()
