CREATE TABLE "email_token" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
