// Generated 2025-10-23T22:38:07.384222Z for Project Chimera

import type { SDKOptions, Routes, SubmitJobParams, SubmitJobResponse, RunCard, LeaderboardResponse } from "./types";

function join(base: string, path: string) { return base.replace(/\/$/, "") + path; }
const DefaultRoutes: Routes = { submit: "/api/submit", runCard: "/api/run-card", leaderboard: "/api/leaderboard", stream: "/api/jobs/:id/stream" };

export class ChimeraClient {
  private base: string; private routes: Routes; private fetcher: typeof fetch;
  constructor(opts: SDKOptions) { this.base = opts.baseUrl; this.routes = { ...DefaultRoutes, ...(opts.routes || {}) }; this.fetcher = opts.fetchImpl || fetch; }
  async submitJob(params: SubmitJobParams): Promise<SubmitJobResponse> {
    const res = await this.fetcher(join(this.base, this.routes.submit), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
    if (!res.ok) throw new Error(`submitJob failed: ${res.status} ${await res.text()}`); return res.json();
  }
  async getRunCard(id: string | number): Promise<RunCard> {
    const res = await this.fetcher(join(this.base, `${this.routes.runCard}/${id}`));
    if (!res.ok) throw new Error(`getRunCard failed: ${res.status} ${await res.text()}`); return res.json();
  }
  async getLeaderboard(params?: { limit?: number }): Promise<LeaderboardResponse> {
    const url = new URL(join(this.base, this.routes.leaderboard), "http://d"); if (params?.limit) url.searchParams.set("limit", String(params.limit));
    const full = this.base.replace(/\/$/, "") + url.pathname + (url.search || "");
    const res = await this.fetcher(full); if (!res.ok) throw new Error(`getLeaderboard failed: ${res.status} ${await res.text()}`); return res.json();
  }
  streamJob(jobId: string | number, onMessage: (data: any) => void): () => void {
    const path = this.routes.stream.replace(":id", String(jobId)); const url = join(this.base, path);
    // @ts-ignore
    const es = new EventSource(url);
    es.onmessage = (evt) => { try { onMessage(JSON.parse(evt.data)); } catch { onMessage((evt as MessageEvent).data); } };
    es.onerror = () => {};
    return () => es.close();
  }
}
