/**
 * Quantum Circuit Evolution Engine
 * Implements genetic algorithm for quantum circuit optimization
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 */

import { updateJob } from "../jobs";

export interface EvolutionConfig {
  populationSize: number;
  maxGenerations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
  targetFitness: number;
}

export interface Gene {
  gate: string;
  qubit: number;
  params?: number[];
  control?: number;
}

export interface Circuit {
  genes: Gene[];
  fitness: number;
}

export interface EvolutionResult {
  bestCircuit: Circuit;
  finalGeneration: number;
  fitnessHistory: number[];
  circuitDepth: number;
  gateCount: number;
}

const DEFAULT_CONFIG: EvolutionConfig = {
  populationSize: 50,
  maxGenerations: 50,
  mutationRate: 0.3,
  crossoverRate: 0.7,
  elitismRate: 0.1,
  targetFitness: 0.95,
};

/**
 * Generate a random gene (quantum gate)
 */
function generateRandomGene(numQubits: number): Gene {
  const gates = ["H", "X", "Y", "Z", "Rx", "Ry", "Rz", "CNOT"];
  const gate = gates[Math.floor(Math.random() * gates.length)];
  const qubit = Math.floor(Math.random() * numQubits);

  const gene: Gene = { gate, qubit };

  // Add parameters for rotation gates
  if (["Rx", "Ry", "Rz"].includes(gate)) {
    gene.params = [Math.random() * 2 * Math.PI];
  }

  // Add control qubit for CNOT
  if (gate === "CNOT" && numQubits > 1) {
    gene.control = Math.floor(Math.random() * numQubits);
    if (gene.control === qubit) {
      gene.control = (qubit + 1) % numQubits;
    }
  }

  return gene;
}

/**
 * Generate a random circuit
 */
function generateRandomCircuit(numQubits: number, length: number): Circuit {
  const genes: Gene[] = [];
  for (let i = 0; i < length; i++) {
    genes.push(generateRandomGene(numQubits));
  }
  return { genes, fitness: 0 };
}

/**
 * Initialize population
 */
function initializePopulation(
  numQubits: number,
  circuitLength: number,
  populationSize: number
): Circuit[] {
  const population: Circuit[] = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(generateRandomCircuit(numQubits, circuitLength));
  }
  return population;
}

/**
 * Evaluate circuit fitness (simplified - would use quantum simulator/hardware)
 */
async function evaluateFitness(circuit: Circuit, target: string): Promise<number> {
  // Simplified fitness calculation
  // In production, this would run on IBM Quantum hardware or simulator
  
  // For Bell state target
  if (target.includes("Bell") || target.includes("entangle")) {
    let hasHadamard = false;
    let hasCNOT = false;
    
    for (const gene of circuit.genes) {
      if (gene.gate === "H") hasHadamard = true;
      if (gene.gate === "CNOT") hasCNOT = true;
    }
    
    if (hasHadamard && hasCNOT) {
      // Good circuit for Bell state
      return 0.85 + Math.random() * 0.15; // 85-100%
    } else if (hasHadamard || hasCNOT) {
      // Partial solution
      return 0.50 + Math.random() * 0.35; // 50-85%
    } else {
      // Poor circuit
      return Math.random() * 0.50; // 0-50%
    }
  }
  
  // Default: random fitness with slight bias toward complexity
  return Math.min(0.95, circuit.genes.length * 0.02 + Math.random() * 0.5);
}

/**
 * Select parents using tournament selection
 */
function selectParent(population: Circuit[], tournamentSize: number = 3): Circuit {
  const tournament: Circuit[] = [];
  for (let i = 0; i < tournamentSize; i++) {
    const idx = Math.floor(Math.random() * population.length);
    tournament.push(population[idx]);
  }
  tournament.sort((a, b) => b.fitness - a.fitness);
  return tournament[0];
}

/**
 * Crossover two circuits
 */
function crossover(parent1: Circuit, parent2: Circuit): Circuit {
  const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.genes.length, parent2.genes.length));
  const childGenes = [
    ...parent1.genes.slice(0, crossoverPoint),
    ...parent2.genes.slice(crossoverPoint),
  ];
  return { genes: childGenes, fitness: 0 };
}

/**
 * Mutate a circuit
 */
function mutate(circuit: Circuit, mutationRate: number, numQubits: number): Circuit {
  const mutatedGenes = circuit.genes.map(gene => {
    if (Math.random() < mutationRate) {
      return generateRandomGene(numQubits);
    }
    return gene;
  });
  return { genes: mutatedGenes, fitness: 0 };
}

/**
 * Run evolution for one generation
 */
async function evolveGeneration(
  population: Circuit[],
  config: EvolutionConfig,
  target: string,
  numQubits: number
): Promise<Circuit[]> {
  // Evaluate fitness for all circuits
  for (const circuit of population) {
    circuit.fitness = await evaluateFitness(circuit, target);
  }

  // Sort by fitness
  population.sort((a, b) => b.fitness - a.fitness);

  // Elitism: keep top performers
  const eliteCount = Math.floor(population.length * config.elitismRate);
  const nextGeneration: Circuit[] = population.slice(0, eliteCount);

  // Generate offspring
  while (nextGeneration.length < population.length) {
    const parent1 = selectParent(population);
    const parent2 = selectParent(population);

    let offspring: Circuit;
    if (Math.random() < config.crossoverRate) {
      offspring = crossover(parent1, parent2);
    } else {
      offspring = { ...parent1, genes: [...parent1.genes] };
    }

    offspring = mutate(offspring, config.mutationRate, numQubits);
    nextGeneration.push(offspring);
  }

  return nextGeneration;
}

/**
 * Calculate circuit metrics
 */
function calculateCircuitMetrics(circuit: Circuit): { depth: number; gateCount: number } {
  return {
    depth: circuit.genes.length,
    gateCount: circuit.genes.length,
  };
}

/**
 * Run complete evolution
 */
export async function runEvolution(
  jobId: string,
  target: string,
  numQubits: number = 2,
  circuitLength: number = 5,
  config: Partial<EvolutionConfig> = {}
): Promise<EvolutionResult> {
  const fullConfig: EvolutionConfig = { ...DEFAULT_CONFIG, ...config };
  
  let population = initializePopulation(numQubits, circuitLength, fullConfig.populationSize);
  const fitnessHistory: number[] = [];

  for (let gen = 0; gen < fullConfig.maxGenerations; gen++) {
    population = await evolveGeneration(population, fullConfig, target, numQubits);
    
    const bestFitness = Math.max(...population.map(c => c.fitness));
    const avgFitness = population.reduce((sum, c) => sum + c.fitness, 0) / population.length;
    
    fitnessHistory.push(bestFitness);

    // Update job progress
    await updateJob(jobId, {
      currentGeneration: gen + 1,
      bestFitness: Math.round(bestFitness * 100),
      avgFitness: Math.round(avgFitness * 100),
    });

    // Check if target reached
    if (bestFitness >= fullConfig.targetFitness) {
      break;
    }

    // Simulate delay (remove in production with real quantum execution)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Get best circuit
  population.sort((a, b) => b.fitness - a.fitness);
  const bestCircuit = population[0];
  const metrics = calculateCircuitMetrics(bestCircuit);

  return {
    bestCircuit,
    finalGeneration: fitnessHistory.length,
    fitnessHistory,
    circuitDepth: metrics.depth,
    gateCount: metrics.gateCount,
  };
}

/**
 * Convert circuit to QASM representation
 */
export function circuitToQASM(circuit: Circuit, numQubits: number): string {
  let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n`;
  qasm += `qreg q[${numQubits}];\n`;
  qasm += `creg c[${numQubits}];\n\n`;

  for (const gene of circuit.genes) {
    switch (gene.gate) {
      case "H":
        qasm += `h q[${gene.qubit}];\n`;
        break;
      case "X":
        qasm += `x q[${gene.qubit}];\n`;
        break;
      case "Y":
        qasm += `y q[${gene.qubit}];\n`;
        break;
      case "Z":
        qasm += `z q[${gene.qubit}];\n`;
        break;
      case "Rx":
        qasm += `rx(${gene.params?.[0]?.toFixed(4)}) q[${gene.qubit}];\n`;
        break;
      case "Ry":
        qasm += `ry(${gene.params?.[0]?.toFixed(4)}) q[${gene.qubit}];\n`;
        break;
      case "Rz":
        qasm += `rz(${gene.params?.[0]?.toFixed(4)}) q[${gene.qubit}];\n`;
        break;
      case "CNOT":
        if (gene.control !== undefined) {
          qasm += `cx q[${gene.control}],q[${gene.qubit}];\n`;
        }
        break;
    }
  }

  qasm += `\nmeasure q -> c;\n`;
  return qasm;
}

