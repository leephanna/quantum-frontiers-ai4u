"""
Local Quantum Simulator (Development Mode)
© 2025 AI4U, LLC. All Rights Reserved.
AI4Utech.com | Lee Hanna, Owner
Project Chimera™ • Powered by IBM Quantum

This simulator runs locally when IBM Quantum API is unavailable.
In production, use run_ibm.py with real hardware.
"""

import os, json, argparse, random
from datetime import datetime

BELL_QASM = r"""
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;
"""

def simulate_bell_state(shots):
    """Simulate Bell state measurement outcomes"""
    # Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2
    # Should give ~50% |00⟩ and ~50% |11⟩
    counts = {"00": 0, "11": 0}
    for _ in range(shots):
        if random.random() < 0.5:
            counts["00"] += 1
        else:
            counts["11"] += 1
    
    # Convert to quasi-probabilities
    quasi_probs = {
        "00": counts["00"] / shots,
        "11": counts["11"] / shots
    }
    
    return quasi_probs, counts

def simulate_generic_circuit(qasm_str, shots):
    """Simulate generic quantum circuit"""
    # Count qubits from QASM
    n_qubits = qasm_str.count("qreg q[") 
    if n_qubits == 0:
        n_qubits = 2  # default
    
    # Extract qubit count
    try:
        import re
        match = re.search(r'qreg q\[(\d+)\]', qasm_str)
        if match:
            n_qubits = int(match.group(1))
    except:
        pass
    
    # Generate random measurement outcomes
    counts = {}
    quasi_probs = {}
    
    # For simplicity, generate a few random bitstrings
    num_outcomes = min(2**n_qubits, 4)  # Max 4 outcomes
    bitstrings = []
    
    for i in range(num_outcomes):
        bitstring = format(i, f'0{n_qubits}b')
        bitstrings.append(bitstring)
    
    # Distribute shots randomly
    remaining = shots
    for i, bs in enumerate(bitstrings):
        if i == len(bitstrings) - 1:
            counts[bs] = remaining
        else:
            count = random.randint(0, remaining)
            counts[bs] = count
            remaining -= count
    
    # Calculate quasi-probs
    for bs, count in counts.items():
        quasi_probs[bs] = count / shots
    
    return quasi_probs, counts

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", default="local_simulator")
    ap.add_argument("--shots", type=int, default=1024)
    ap.add_argument("--qasm_file", type=str, default=None)
    ap.add_argument("--qasm", type=str, default=None)
    args = ap.parse_args()
    
    qasm_str = args.qasm or BELL_QASM
    if args.qasm_file:
        try:
            with open(args.qasm_file, "r", encoding="utf-8") as f:
                qasm_str = f.read()
        except Exception as e:
            print(json.dumps({"error": f"Failed to read qasm_file: {e}"}))
            return
    
    payload = {
        "backend": args.backend,
        "shots": args.shots,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "status": "submitted",
        "job_id": f"local_sim_{random.randint(100000, 999999)}"
    }
    
    try:
        # Check if it's a Bell state circuit
        if "h q[0]" in qasm_str and "cx q[0]" in qasm_str:
            quasi_probs, counts = simulate_bell_state(args.shots)
        else:
            quasi_probs, counts = simulate_generic_circuit(qasm_str, args.shots)
        
        payload["quasi_probs"] = quasi_probs
        payload["counts"] = counts
        payload["status"] = "completed"
        
    except Exception as e:
        payload["status"] = "failed"
        payload["error"] = str(e)
    
    print(json.dumps(payload))

if __name__ == "__main__":
    main()

