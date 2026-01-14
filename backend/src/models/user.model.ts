import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
	id: uuid("id").primaryKey(),
	fullname: varchar("fullname", { length: 50 }).notNull(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	profilePicture: text("profile_picture"),
	colorAvatar: varchar("color_avatar"),
	jobTitle: varchar("job_title", { length: 50 }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updateAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export type UserRecord = typeof userTable.$inferSelect;
export type NewUserRecord = typeof userTable.$inferInsert;
