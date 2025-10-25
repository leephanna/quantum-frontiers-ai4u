// Circuit operators for Project Chimera evolution engine
// © 2025 AI4U, LLC. All Rights Reserved. | AI4Utech.com | Lee Hanna, Owner

import type { EvalContext, OpContext, FitnessResult } from "./types";

/**
 * Evaluate a quantum circuit genome (OpenQASM string)
 * Returns fitness score based on target state fidelity
 */
export async function evaluateCircuit(
  genome: string,
  ctx: EvalContext
): Promise<FitnessResult> {
  // Parse OpenQASM to count gates and depth
  const lines = genome.split('\n').filter(l => l.trim() && !l.startsWith('//'));
  const gateLines = lines.filter(l => 
    !l.includes('OPENQASM') && 
    !l.includes('include') && 
    !l.includes('qreg') && 
    !l.includes('creg')
  );
  
  const depth = gateLines.length;
  const gateCount = gateLines.length;
  
  // Simulate circuit fitness (in production, use Qiskit)
  // For now, reward circuits with CNOT gates (entanglement) and penalize excessive depth
  const hasCNOT = genome.includes('cx ') || genome.includes('cnot');
  const hasHadamard = genome.includes('h ');
  
  let fitness = 0.5; // Base fitness
  
  if (hasHadamard) fitness += 0.2; // Hadamard creates superposition
  if (hasCNOT) fitness += 0.3; // CNOT creates entanglement
  
  // Penalize excessive depth
  if (depth > 10) fitness -= (depth - 10) * 0.01;
  if (depth < 2) fitness -= 0.1; // Too simple
  
  // Add some randomness to simulate quantum measurement noise
  fitness += (ctx.rng() - 0.5) * 0.05;
  
  // Clamp to [0, 1]
  fitness = Math.max(0, Math.min(1, fitness));
  
  return {
    fitness,
    objectives: {
      fidelity: fitness,
      depth: -depth * 0.01, // Negative because we want to minimize depth
    },
    metrics: {
      gateCount,
      depth,
      hasCNOT: hasCNOT ? 1 : 0,
      hasHadamard: hasHadamard ? 1 : 0,
    },
  };
}

/**
 * Mutate a circuit genome by adding, removing, or modifying gates
 */
export function mutateCircuit(genome: string, ctx: OpContext): string {
  const lines = genome.split('\n');
  const gateTypes = ['h', 'x', 'y', 'z', 'cx', 's', 't'];
  
  // Find qubit count
  const qregLine = lines.find(l => l.includes('qreg'));
  const qubitMatch = qregLine?.match(/qreg q\[(\d+)\]/);
  const numQubits = qubitMatch ? parseInt(qubitMatch[1]) : 2;
  
  // Mutation strategies
  const strategy = Math.floor(ctx.rng() * 4);
  
  if (strategy === 0) {
    // Add a random gate
    const gate = gateTypes[Math.floor(ctx.rng() * gateTypes.length)];
    let newGate: string;
    
    if (gate === 'cx' && numQubits >= 2) {
      const q1 = Math.floor(ctx.rng() * numQubits);
      let q2 = Math.floor(ctx.rng() * numQubits);
      while (q2 === q1) q2 = Math.floor(ctx.rng() * numQubits);
      newGate = `cx q[${q1}],q[${q2}];`;
    } else {
      const q = Math.floor(ctx.rng() * numQubits);
      newGate = `${gate} q[${q}];`;
    }
    
    // Insert before the last line (usually empty or measurement)
    lines.splice(lines.length - 1, 0, newGate);
    
  } else if (strategy === 1) {
    // Remove a random gate
    const gateLines = lines.filter((l, i) => 
      i > 0 && l.trim() && !l.includes('OPENQASM') && !l.includes('include') && 
      !l.includes('qreg') && !l.includes('creg')
    );
    
    if (gateLines.length > 1) {
      const toRemove = gateLines[Math.floor(ctx.rng() * gateLines.length)];
      const idx = lines.indexOf(toRemove);
      if (idx >= 0) lines.splice(idx, 1);
    }
    
  } else if (strategy === 2) {
    // Replace a random gate
    const gateLines = lines.filter((l, i) => 
      i > 0 && l.trim() && !l.includes('OPENQASM') && !l.includes('include') && 
      !l.includes('qreg') && !l.includes('creg')
    );
    
    if (gateLines.length > 0) {
      const toReplace = gateLines[Math.floor(ctx.rng() * gateLines.length)];
      const idx = lines.indexOf(toReplace);
      
      const gate = gateTypes[Math.floor(ctx.rng() * gateTypes.length)];
      let newGate: string;
      
      if (gate === 'cx' && numQubits >= 2) {
        const q1 = Math.floor(ctx.rng() * numQubits);
        let q2 = Math.floor(ctx.rng() * numQubits);
        while (q2 === q1) q2 = Math.floor(ctx.rng() * numQubits);
        newGate = `cx q[${q1}],q[${q2}];`;
      } else {
        const q = Math.floor(ctx.rng() * numQubits);
        newGate = `${gate} q[${q}];`;
      }
      
      if (idx >= 0) lines[idx] = newGate;
    }
    
  } else {
    // Swap two gates
    const gateLines = lines.filter((l, i) => 
      i > 0 && l.trim() && !l.includes('OPENQASM') && !l.includes('include') && 
      !l.includes('qreg') && !l.includes('creg')
    );
    
    if (gateLines.length >= 2) {
      const idx1 = lines.indexOf(gateLines[Math.floor(ctx.rng() * gateLines.length)]);
      const idx2 = lines.indexOf(gateLines[Math.floor(ctx.rng() * gateLines.length)]);
      
      if (idx1 >= 0 && idx2 >= 0 && idx1 !== idx2) {
        [lines[idx1], lines[idx2]] = [lines[idx2], lines[idx1]];
      }
    }
  }
  
  return lines.join('\n');
}

/**
 * Crossover two circuit genomes by splicing gate sequences
 */
export function crossoverCircuits(a: string, b: string, ctx: OpContext): string {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  
  // Extract header (OPENQASM, include, qreg, creg)
  const headerA = linesA.filter(l => 
    l.includes('OPENQASM') || l.includes('include') || l.includes('qreg') || l.includes('creg')
  );
  
  // Extract gates
  const gatesA = linesA.filter(l => 
    l.trim() && !l.includes('OPENQASM') && !l.includes('include') && 
    !l.includes('qreg') && !l.includes('creg')
  );
  
  const gatesB = linesB.filter(l => 
    l.trim() && !l.includes('OPENQASM') && !l.includes('include') && 
    !l.includes('qreg') && !l.includes('creg')
  );
  
  // Single-point crossover
  const cutPoint = Math.floor(ctx.rng() * Math.min(gatesA.length, gatesB.length));
  
  const childGates = [
    ...gatesA.slice(0, cutPoint),
    ...gatesB.slice(cutPoint),
  ];
  
  return [...headerA, ...childGates, ''].join('\n');
}

/**
 * Generate a random valid OpenQASM circuit
 */
export function randomCircuit(ctx: OpContext, numQubits = 2, numGates = 3): string {
  const gateTypes = ['h', 'x', 'y', 'z', 'cx', 's', 't'];
  const gates: string[] = [];
  
  for (let i = 0; i < numGates; i++) {
    const gate = gateTypes[Math.floor(ctx.rng() * gateTypes.length)];
    
    if (gate === 'cx' && numQubits >= 2) {
      const q1 = Math.floor(ctx.rng() * numQubits);
      let q2 = Math.floor(ctx.rng() * numQubits);
      while (q2 === q1) q2 = Math.floor(ctx.rng() * numQubits);
      gates.push(`cx q[${q1}],q[${q2}];`);
    } else {
      const q = Math.floor(ctx.rng() * numQubits);
      gates.push(`${gate} q[${q}];`);
    }
  }
  
  return [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${numQubits}];`,
    `creg c[${numQubits}];`,
    ...gates,
    '',
  ].join('\n');
}

