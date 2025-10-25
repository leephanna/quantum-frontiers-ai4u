// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

export interface SubmitJobParams { qasm: string; backend?: string; shots?: number; hardware?: boolean; meta?: Record<string, unknown>; }
export interface SubmitJobResponse { jobId: string; runCardId?: number; status: "queued" | "running" | "completed" | "failed"; }
export interface RunCard { id: number; jobId: string; backend: string; shots: number; fitness?: string; qasm?: string; counts?: Record<string, number>; createdAt: string; [k: string]: unknown; }
export interface LeaderboardEntry { id: number; backend: string; shots: number; fitness?: string; createdAt: string; }
export interface LeaderboardResponse { items: LeaderboardEntry[]; }
export interface Routes { submit: string; runCard: string; leaderboard: string; stream: string; }
export interface SDKOptions { baseUrl: string; routes?: Partial<Routes>; fetchImpl?: typeof fetch; }
