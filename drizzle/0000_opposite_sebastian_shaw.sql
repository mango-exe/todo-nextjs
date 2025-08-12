CREATE TABLE `todos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` enum('TO_DO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TO_DO',
	`description` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`hashedPassword` varchar(255) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`token` varchar(255),
	`expiry` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `todos` ADD CONSTRAINT `todos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;