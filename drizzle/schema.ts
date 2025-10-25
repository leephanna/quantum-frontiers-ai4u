import { mysqlEnum, mysqlTable, text, timestamp, varchar, json, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Jobs table for quantum circuit evolution orchestration
 * Tracks evolution jobs from creation through completion
 */
export const jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }),
  application: varchar("application", { length: 64 }).notNull(), // drug, finance, materials, aerospace, telecom, healthcare
  circuitSpec: text("circuitSpec").notNull(),
  targetFitness: int("targetFitness").notNull(), // stored as int (0-100) for simplicity
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
  currentGeneration: int("currentGeneration").default(0),
  maxGenerations: int("maxGenerations").default(50),
  bestFitness: int("bestFitness").default(0), // stored as int (0-100)
  avgFitness: int("avgFitness").default(0), // stored as int (0-100)
  result: json("result"), // final circuit, metrics, etc.
  errorMessage: text("errorMessage"),
  useRealHardware: boolean("useRealHardware").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Run Cards table for storing shareable evolution results
 * Each successful job generates a Run Card for marketing/sharing
 */
export const runCards = mysqlTable("runCards", {
  id: varchar("id", { length: 64 }).primaryKey(),
  jobId: varchar("jobId", { length: 64 }).notNull(),
  application: varchar("application", { length: 64 }).notNull(),
  finalFitness: int("finalFitness").notNull(),
  generations: int("generations").notNull(),
  circuitDepth: int("circuitDepth"),
  gateCount: int("gateCount"),
  hardware: varchar("hardware", { length: 128 }), // ibm_brisbane, simulator, etc.
  metrics: json("metrics"), // detailed metrics
  circuit: text("circuit"), // final circuit representation
  createdAt: timestamp("createdAt").defaultNow(),
});

export type RunCard = typeof runCards.$inferSelect;
export type InsertRunCard = typeof runCards.$inferInsert;

/**
 * Hardware Runs table for tracking IBM Quantum hardware executions
 * Stores results from real quantum processor runs
 * © 2025 AI4U, LLC. All Rights Reserved.
 */
export const hardwareRuns = mysqlTable("hardwareRuns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  jobId: varchar("jobId", { length: 64 }).notNull(),
  backend: varchar("backend", { length: 128 }).notNull(), // ibm_brisbane, ibmq_qasm_simulator, etc.
  status: mysqlEnum("status", ["submitted", "running", "completed", "failed"]).default("submitted").notNull(),
  shots: int("shots").notNull().default(1024),
  ibmJobId: varchar("ibmJobId", { length: 128 }), // IBM Quantum job ID
  quasiProbs: json("quasiProbs"), // quasi-probability distribution
  counts: json("counts"), // measurement counts
  errorMessage: text("errorMessage"),
  qasm: text("qasm"), // OpenQASM circuit
  createdAt: timestamp("createdAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

export type HardwareRun = typeof hardwareRuns.$inferSelect;
export type InsertHardwareRun = typeof hardwareRuns.$inferInsert;
