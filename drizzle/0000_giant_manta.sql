CREATE TABLE `todos` (
	`id` int NOT NULL,
	`state_enum` enum('TODO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TODO',
	`description` varchar(255) NOT NULL,
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`hashedPassword` varchar(255) NOT NULL,
	`salt` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
