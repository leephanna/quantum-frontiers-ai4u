// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

import { DefaultRestart, DefaultSchedule } from "./params";
import { tournamentSelect, mulberry32 } from "./strategies";
import type { EvolutionOptions, EvolutionTrace, GenerationSummary, Individual, Genome, RNG, EvalContext } from "./types";

function scheduleAt(gen: number, maxGen: number, rng: RNG, opts = DefaultSchedule): number {
  const t = Math.min(1, Math.max(0, gen / Math.max(1, maxGen)));
  if (opts.type === "linear") return opts.start + (opts.end - opts.start) * t;
  if (opts.type === "cosine") { const c = (1 - Math.cos(Math.PI * t)) / 2; return opts.start + (opts.end - opts.start) * c; }
  const halfLife = opts.halfLife ?? 20; const decay = Math.pow(0.5, gen / Math.max(1, halfLife));
  return opts.end + (opts.start - opts.end) * decay;
}
function weightedScore(ind: Individual, weights?: Record<string, number>): number {
  if (!weights || !ind.objectives) return ind.fitness;
  let s = 0; for (const [k, w] of Object.entries(weights)) s += (ind.objectives[k] ?? 0) * w;
  return s + ind.fitness;
}
async function evaluatePopulation(genomes: Genome[], evaluate: EvolutionOptions["evaluate"], ctxBase: EvalContext, concurrency = 8): Promise<Individual[]> {
  const results: Individual[] = []; let idx = 0;
  async function worker() {
    while (idx < genomes.length) {
      const i = idx++; const genome = genomes[i];
      const fr = await evaluate(genome, ctxBase);
      results[i] = { genome, fitness: fr.fitness, objectives: fr.objectives, metrics: fr.metrics };
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, genomes.length) }, worker);
  await Promise.all(workers); return results;
}
export async function runEvolution(options: EvolutionOptions): Promise<EvolutionTrace> {
  const { seed = Math.floor(Math.random()*1e9), populationSize, maxGenerations, targetFitness = 0.999,
    elitismPct = 0.10, schedule = DefaultSchedule, restart = DefaultRestart, objectives, evaluate, mutate, crossover,
    initialPopulation, randomInit, concurrency = 8, keepTrace = true } = options;
  if (!initialPopulation && !randomInit) throw new Error("Either initialPopulation or randomInit must be provided.");
  const rng = mulberry32(seed);
  let population: Genome[] = initialPopulation ?? Array.from({ length: populationSize }, () => randomInit!({ generation: 0, rng }));
  let history: GenerationSummary[] = []; let bestEver: Individual | null = null;
  let stagnation = 0; let restarts = 0; let lastBest = -Infinity;

  for (let gen = 0; gen < maxGenerations; gen++) {
    const mutProb = scheduleAt(gen, maxGenerations, rng, schedule);
    const evaluated = await evaluatePopulation(population, evaluate, { generation: gen, rng }, concurrency);
    evaluated.sort((a, b) => weightedScore(b, objectives) - weightedScore(a, objectives));
    const best = evaluated[0]; if (!bestEver || best.fitness > bestEver.fitness) bestEver = { ...best };
    const relGain = (best.fitness - (lastBest > 0 ? lastBest : 0)) / (lastBest > 0 ? lastBest : 1);
    if (best.fitness > lastBest + 1e-12) { stagnation = 0; lastBest = best.fitness; } else { stagnation++; }
    const avg = evaluated.reduce((s, e) => s + e.fitness, 0) / Math.max(1, evaluated.length);
    const eliteCount = Math.max(1, Math.floor(elitismPct * populationSize));
    const elites = evaluated.slice(0, eliteCount);
    const summary: GenerationSummary = { gen, mutationProb: mutProb, best, avgFitness: avg, elites };
    if (keepTrace) history.push(summary);
    if (best.fitness >= targetFitness) return { best: bestEver!, history, finalPopulation: evaluated, restarts };

    let doRestart = false

    if (stagnation >= restart.stagnationWindow && relGain < restart.minRelativeGain) {
      if (!restart.maxRestarts || restarts < restart.maxRestarts) { doRestart = true; restarts++; stagnation = 0; }
    }
    let nextPop: Genome[] = [];
    for (const e of elites) nextPop.push(e.genome);
    const opCtx = { generation: gen, rng } as any;
    const toFill = populationSize - nextPop.length;
    for (let i = 0; i < toFill; i++) {
      let child: Genome;
      if (evaluated.length >= 2) {
        const p1 = evaluated[Math.floor(rng()*evaluated.length)].genome;
        const p2 = evaluated[Math.floor(rng()*evaluated.length)].genome;
        child = crossover(p1, p2, opCtx);
      } else {
        child = (randomInit ? randomInit(opCtx) : elites[0].genome);
      }
      let p = mutProb * (doRestart ? 2.0 : 1.0); if (p > 1) p = 1;
      if (rng() < p) child = mutate(child, opCtx);
      nextPop.push(child);
    }
    if (doRestart && randomInit) {
      const eliteCount2 = Math.max(1, Math.floor(elitismPct * populationSize));
      const reinit = Math.floor(restart.reinitFraction * populationSize);
      for (let i = 0; i < reinit && eliteCount2 + i < nextPop.length; i++) {
        nextPop[eliteCount2 + i] = randomInit({ generation: gen, rng });
      }
      history[history.length - 1] = { ...summary, restarted: true };
    }
    population = nextPop;
  }
  const evaluated = await evaluatePopulation(population, evaluate, { generation: maxGenerations, rng }, concurrency);
  evaluated.sort((a, b) => b.fitness - a.fitness);
  const best = evaluated[0]; if (!bestEver || best.fitness > bestEver.fitness) bestEver = { ...best };
  return { best: bestEver!, history, finalPopulation: evaluated, restarts };
}
