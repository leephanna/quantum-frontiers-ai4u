CREATE TABLE `jobs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`application` varchar(64) NOT NULL,
	`circuitSpec` text NOT NULL,
	`targetFitness` int NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`currentGeneration` int DEFAULT 0,
	`maxGenerations` int DEFAULT 50,
	`bestFitness` int DEFAULT 0,
	`avgFitness` int DEFAULT 0,
	`result` json,
	`errorMessage` text,
	`useRealHardware` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `runCards` (
	`id` varchar(64) NOT NULL,
	`jobId` varchar(64) NOT NULL,
	`application` varchar(64) NOT NULL,
	`finalFitness` int NOT NULL,
	`generations` int NOT NULL,
	`circuitDepth` int,
	`gateCount` int,
	`hardware` varchar(128),
	`metrics` json,
	`circuit` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `runCards_id` PRIMARY KEY(`id`)
);
