// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

export type RNG = () => number;
export type Genome = string;
export type Objectives = Record<string, number>;

export interface FitnessResult { fitness: number; objectives?: Objectives; metrics?: Record<string, number | string>; }
export interface Individual { genome: Genome; fitness: number; objectives?: Objectives; metrics?: Record<string, number | string>; depth?: number; }

export interface EvolutionSchedule { type: "linear" | "exp" | "cosine"; start: number; end: number; halfLife?: number; }
export interface RestartPolicy { stagnationWindow: number; minRelativeGain: number; reinitFraction: number; maxRestarts?: number; }

export interface EvolutionOptions {
  seed?: number; populationSize: number; maxGenerations: number; targetFitness?: number;
  elitismPct?: number; schedule?: EvolutionSchedule; restart?: RestartPolicy; objectives?: Record<string, number>;
  evaluate: (genome: Genome, ctx: EvalContext) => Promise<FitnessResult>;
  mutate: (genome: Genome, ctx: OpContext) => Genome;
  crossover: (a: Genome, b: Genome, ctx: OpContext) => Genome;
  initialPopulation?: Genome[]; randomInit?: (ctx: OpContext) => Genome; concurrency?: number; keepTrace?: boolean;
}
export interface EvalContext { generation: number; rng: RNG; }
export interface OpContext extends EvalContext {}

export interface GenerationSummary { gen: number; mutationProb: number; best: Individual; avgFitness: number; elites: Individual[]; restarted?: boolean; }
export interface EvolutionTrace { best: Individual; history: GenerationSummary[]; finalPopulation: Individual[]; restarts: number; }
