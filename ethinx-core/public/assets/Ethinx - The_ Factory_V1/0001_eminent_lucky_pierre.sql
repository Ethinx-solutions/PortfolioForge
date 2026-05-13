CREATE TABLE `neural_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`salesEventId` int,
	`customer` varchar(255) NOT NULL,
	`amountCents` int NOT NULL,
	`tier` varchar(32) NOT NULL,
	`priority` enum('standard','high','critical') NOT NULL DEFAULT 'standard',
	`status` enum('new','acknowledged','processed','dismissed') NOT NULL DEFAULT 'new',
	`sessionId` varchar(64),
	`acknowledgedAt` timestamp,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `neural_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(128),
	`customer` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`amountCents` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'AUD',
	`tier` enum('Starter','Growth','Pro','Elite','Enterprise','Vault') NOT NULL,
	`eventType` enum('checkout','upsell','cross_sell','refund') NOT NULL DEFAULT 'checkout',
	`source` enum('stripe','hetzner','manual','simulation') NOT NULL DEFAULT 'stripe',
	`stripeSessionId` varchar(255),
	`metadata` json,
	`eventTimestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_events_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `system_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricName` varchar(64) NOT NULL,
	`metricValue` varchar(128) NOT NULL,
	`changePercent` decimal(8,2),
	`status` enum('green','yellow','red') NOT NULL DEFAULT 'green',
	`period` enum('hourly','daily','weekly','monthly') NOT NULL DEFAULT 'daily',
	`computedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_metrics_id` PRIMARY KEY(`id`)
);
