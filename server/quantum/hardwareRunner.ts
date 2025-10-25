/**
 * Hardware Runner - Node.js adapter for Python quantum runner
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 * Project Chimera™ • Powered by IBM Quantum
 */

import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

export type HardwareRunInput = {
  qasm: string;
  backend: string; // e.g., 'ibmq_qasm_simulator', 'ibm_brisbane', or 'local_simulator'
  shots?: number; // default 1024
  pythonPath?: string; // path to python if needed
};

export type HardwareRunResult = {
  job_id: string;
  backend: string;
  shots: number;
  status: "submitted" | "running" | "completed" | "failed";
  quasi_probs?: Record<string, number>;
  counts?: Record<string, number>;
  error?: string;
  created_at: string;
};

/**
 * Submit a quantum circuit to hardware (IBM Quantum or local simulator)
 * Returns immediately with job info; results may be available after polling
 */
export async function submitHardwareRun(input: HardwareRunInput): Promise<HardwareRunResult> {
  const shots = input.shots ?? 1024;
  const python = input.pythonPath ?? "python3";
  
  // Determine which runner to use
  const useLocalSim = !process.env.IBM_QUANTUM_TOKEN || input.backend === "local_simulator";
  const runnerScript = useLocalSim 
    ? "services/quantum_runner/run_local_sim.py"
    : "services/quantum_runner/run_ibm.py";
  
  const args = [
    runnerScript,
    "--backend", input.backend,
    "--shots", String(shots),
    "--qasm", input.qasm
  ];
  
  // Add --use-sampler for IBM runner
  if (!useLocalSim) {
    args.push("--use-sampler");
  }
  
  return new Promise((resolve, reject) => {
    const proc = spawn(python, args, { 
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        IBM_QUANTUM_API_TOKEN: process.env.IBM_QUANTUM_TOKEN || "",
      }
    });
    
    let out = "";
    let err = "";
    
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));
    
    proc.on("close", (code) => {
      if (code !== 0 && !out) {
        return reject(new Error(`Hardware runner exited ${code}: ${err}`));
      }
      
      try {
        const payload = JSON.parse(out.trim());
        resolve(payload as HardwareRunResult);
      } catch (e) {
        reject(new Error(`Invalid JSON from runner: ${out}\nERR: ${err}`));
      }
    });
  });
}

/**
 * Generate a unique ID for hardware runs
 */
export function generateHardwareRunId(): string {
  return `hw_${randomBytes(16).toString("hex")}`;
}

