CREATE TABLE `hardwareRuns` (
	`id` varchar(64) NOT NULL,
	`jobId` varchar(64) NOT NULL,
	`backend` varchar(128) NOT NULL,
	`status` enum('submitted','running','completed','failed') NOT NULL DEFAULT 'submitted',
	`shots` int NOT NULL DEFAULT 1024,
	`ibmJobId` varchar(128),
	`quasiProbs` json,
	`counts` json,
	`errorMessage` text,
	`qasm` text,
	`createdAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `hardwareRuns_id` PRIMARY KEY(`id`)
);
