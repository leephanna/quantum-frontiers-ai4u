// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

import type { EvolutionSchedule, RestartPolicy } from "./types";
export const DefaultSchedule: EvolutionSchedule = { type: "exp", start: 0.25, end: 0.01, halfLife: 20 };
export const DefaultRestart: RestartPolicy = { stagnationWindow: 5, minRelativeGain: 0.002, reinitFraction: 0.75, maxRestarts: 5 };
