ALTER TABLE `todos` ADD `state` enum('TODO','IN_PROGRESS','DONE') DEFAULT 'TODO' NOT NULL;--> statement-breakpoint
ALTER TABLE `todos` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `todos` ADD CONSTRAINT `todos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `todos` DROP COLUMN `state_enum`;