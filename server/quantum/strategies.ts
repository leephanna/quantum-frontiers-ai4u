// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

import type { Individual, RNG } from "./types";
export function tournamentSelect(pop: Individual[], k = 3, rng: RNG = Math.random): Individual {
  let best: Individual | null = null;
  for (let i = 0; i < k; i++) {
    const pick = pop[Math.floor(rng() * pop.length)];
    if (!best || pick.fitness > (best?.fitness ?? -Infinity)) best = pick;
  }
  return best!;
}
export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
