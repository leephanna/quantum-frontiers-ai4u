/**
 * Database helper functions for quantum evolution jobs
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 */

import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { jobs, runCards, InsertJob, InsertRunCard, Job, RunCard } from "../drizzle/schema";
import { randomBytes } from "crypto";

/**
 * Generate a unique job ID
 */
export function generateJobId(): string {
  return `job_${randomBytes(16).toString("hex")}`;
}

/**
 * Generate a unique run card ID
 */
export function generateRunCardId(): string {
  return `rc_${randomBytes(16).toString("hex")}`;
}

/**
 * Create a new evolution job
 */
export async function createJob(data: Omit<InsertJob, "id">): Promise<Job> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const id = generateJobId();
  const jobData: InsertJob = {
    id,
    ...data,
  };

  await db.insert(jobs).values(jobData);
  
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (result.length === 0) {
    throw new Error("Failed to create job");
  }

  return result[0];
}

/**
 * Get a job by ID
 */
export async function getJob(id: string): Promise<Job | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update job status and progress
 */
export async function updateJob(
  id: string,
  updates: Partial<Omit<Job, "id" | "createdAt">>
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(jobs).set(updates).where(eq(jobs.id, id));
}

/**
 * Get all jobs for a user
 */
export async function getUserJobs(userId: string): Promise<Job[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(jobs)
    .where(eq(jobs.userId, userId))
    .orderBy(desc(jobs.createdAt));
}

/**
 * Get recent jobs (for public leaderboard)
 */
export async function getRecentJobs(limit: number = 10): Promise<Job[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "completed"))
    .orderBy(desc(jobs.completedAt))
    .limit(limit);
}

/**
 * Create a run card from a completed job
 */
export async function createRunCard(jobId: string): Promise<RunCard> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const job = await getJob(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  if (job.status !== "completed") {
    throw new Error("Job not completed");
  }

  const id = generateRunCardId();
  const resultData = job.result as any;
  const runCardData: InsertRunCard = {
    id,
    jobId: job.id,
    application: job.application,
    finalFitness: job.bestFitness ?? 0,
    generations: job.currentGeneration ?? 0,
    circuitDepth: resultData?.circuitDepth,
    gateCount: resultData?.gateCount,
    hardware: job.useRealHardware ? "ibm_brisbane" : "simulator",
    metrics: job.result,
    circuit: resultData?.circuit,
  };

  await db.insert(runCards).values(runCardData);

  const result = await db.select().from(runCards).where(eq(runCards.id, id)).limit(1);
  if (result.length === 0) {
    throw new Error("Failed to create run card");
  }

  return result[0];
}

/**
 * Get a run card by ID
 */
export async function getRunCard(id: string): Promise<RunCard | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(runCards).where(eq(runCards.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all run cards (for leaderboard)
 */
export async function getAllRunCards(limit: number = 50): Promise<RunCard[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(runCards)
    .orderBy(desc(runCards.finalFitness), desc(runCards.createdAt))
    .limit(limit);
}

/**
 * Get run cards by application
 */
export async function getRunCardsByApplication(application: string): Promise<RunCard[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(runCards)
    .where(eq(runCards.application, application))
    .orderBy(desc(runCards.finalFitness))
    .limit(20);
}

