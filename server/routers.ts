import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createJob, getJob, getUserJobs, getRecentJobs, createRunCard, getRunCard, getAllRunCards, getRunCardsByApplication, updateJob } from "./jobs";
import { runEvolution } from "./quantum/evolution";
import { evaluateCircuit, mutateCircuit, crossoverCircuits, randomCircuit } from "./quantum/circuit-operators";
import { submitHardwareRun, generateHardwareRunId } from "./quantum/hardwareRunner";
import { hardwareRuns } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

/**
 * Run evolution job in background
 */
async function runEvolutionJob(
  jobId: string,
  circuitSpec: string,
  targetFitness: number,
  maxGenerations: number
): Promise<void> {
  try {
    // Update job status to running
    await updateJob(jobId, {
      status: "running",
      startedAt: new Date(),
    });

    // Run evolution with new engine
    const result = await runEvolution({
      populationSize: 64,
      maxGenerations,
      targetFitness: targetFitness / 100, // Convert percentage to 0-1
      elitismPct: 0.12,
      objectives: { fidelity: 1.0, depth: -0.02 },
      evaluate: evaluateCircuit,
      mutate: mutateCircuit,
      crossover: crossoverCircuits,
      randomInit: (ctx) => randomCircuit(ctx, 2, 3),
      concurrency: 8,
      keepTrace: true,
    });

    // Best circuit is already QASM
    const qasm = result.best.genome;

    // Update job with results
    await updateJob(jobId, {
      status: "completed",
      completedAt: new Date(),
      result: {
        circuit: qasm,
        circuitDepth: result.best.metrics?.depth as number || 0,
        gateCount: result.best.metrics?.gateCount as number || 0,
        fitnessHistory: result.history.map(h => h.best.fitness),
        finalFitness: result.best.fitness,
        restarts: result.restarts,
      },
    });

    // Create run card
    await createRunCard(jobId);
  } catch (error) {
    console.error(`Evolution job ${jobId} failed:`, error);
    await updateJob(jobId, {
      status: "failed",
      completedAt: new Date(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Orchestrator router for quantum evolution jobs
   * © 2025 AI4U, LLC. All Rights Reserved.
   */
  orchestrator: router({
    // Create a new evolution job
    createJob: publicProcedure
      .input(z.object({
        application: z.enum(["drug", "finance", "materials", "aerospace", "telecom", "healthcare"]),
        circuitSpec: z.string(),
        targetFitness: z.number().min(0).max(100).default(95),
        maxGenerations: z.number().min(1).max(100).default(50),
        useRealHardware: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const job = await createJob({
          userId: ctx.user?.id,
          application: input.application,
          circuitSpec: input.circuitSpec,
          targetFitness: input.targetFitness,
          maxGenerations: input.maxGenerations,
          useRealHardware: input.useRealHardware,
        });

        // Start evolution in background
        runEvolutionJob(job.id, input.circuitSpec, input.targetFitness / 100, input.maxGenerations)
          .catch((err: unknown) => console.error(`Evolution job ${job.id} failed:`, err));

        return job;
      }),

    // Get job status
    getJob: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const job = await getJob(input.id);
        if (!job) {
          throw new Error("Job not found");
        }
        return job;
      }),

    // Get user's jobs
    getUserJobs: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserJobs(ctx.user.id);
      }),

    // List jobs with pagination
    listJobs: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ ctx, input }) => {
        const jobs = await getUserJobs(ctx.user.id);
        return jobs.slice(0, input.limit);
      }),

    // Get recent jobs (public leaderboard)
    getRecentJobs: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getRecentJobs(input.limit);
      }),

    // Get run card
    getRunCard: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const runCard = await getRunCard(input.id);
        if (!runCard) {
          throw new Error("Run card not found");
        }
        return runCard;
      }),

    // Get all run cards (leaderboard)
    getAllRunCards: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getAllRunCards(input.limit);
      }),

    // Get run cards by application
    getRunCardsByApplication: publicProcedure
      .input(z.object({ application: z.string() }))
      .query(async ({ input }) => {
        return await getRunCardsByApplication(input.application);
      }),

    /**
     * Submit circuit to IBM Quantum hardware
     * © 2025 AI4U, LLC - Project Chimera™
     */
    runHardware: publicProcedure
      .input(z.object({
        jobId: z.string(),
        qasm: z.string(),
        backend: z.string().default("local_simulator"),
        shots: z.number().optional().default(1024),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const runId = generateHardwareRunId();

        try {
          // Submit to hardware runner
          const result = await submitHardwareRun({
            qasm: input.qasm,
            backend: input.backend,
            shots: input.shots,
          });

          // Store hardware run
          await db.insert(hardwareRuns).values({
            id: runId,
            jobId: input.jobId,
            backend: input.backend,
            status: result.status,
            shots: input.shots,
            ibmJobId: result.job_id,
            quasiProbs: result.quasi_probs,
            counts: result.counts,
            qasm: input.qasm,
            errorMessage: result.error,
            ...(result.status === "completed" && { completedAt: new Date() }),
          });

          return {
            id: runId,
            ibmJobId: result.job_id,
            status: result.status,
            counts: result.counts,
            quasiProbs: result.quasi_probs,
          };
        } catch (error) {
          // Store failed run
          await db.insert(hardwareRuns).values({
            id: runId,
            jobId: input.jobId,
            backend: input.backend,
            status: "failed",
            shots: input.shots,
            qasm: input.qasm,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          });

          throw error;
        }
      }),

    /**
     * Get hardware run status
     */
    getHardwareRun: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.select().from(hardwareRuns).where(eq(hardwareRuns.id, input.id)).limit(1);
        if (result.length === 0) {
          throw new Error("Hardware run not found");
        }
        return result[0];
      }),

    /**
     * Get leaderboard (top hardware runs)
     */
    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        const runCards = await getAllRunCards(input.limit);
        return runCards.sort((a, b) => b.finalFitness - a.finalFitness);
      }),
  }),
});

export type AppRouter = typeof appRouter;
