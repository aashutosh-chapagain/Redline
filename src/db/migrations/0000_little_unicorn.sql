CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`local_uri` text NOT NULL,
	`remote_path` text,
	`width` integer,
	`height` integer,
	`brightness_score` real,
	`sharpness_score` real,
	`low_quality` integer DEFAULT false NOT NULL,
	`upload_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`site_id` text NOT NULL,
	`user_id` text NOT NULL,
	`category` text,
	`severity` text,
	`people_involved` text,
	`area` text,
	`inspection_result` text,
	`occurred_at` integer NOT NULL,
	`description` text,
	`latitude` real,
	`longitude` real,
	`location_accuracy_m` real,
	`location_text` text,
	`suggested_category` text,
	`suggestion_confidence` real,
	`model_version` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sync_attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`synced_at` integer,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`site_ids` text NOT NULL
);
