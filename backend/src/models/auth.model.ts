import bcrypt from "bcryptjs";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { IAuth } from "../types/auth.interface";

export const authTable = pgTable("auth", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 50 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	profilePicture: text("profile_picture"),
	passwordResetToken: varchar("password_reset_token", { length: 255 }),
	passwordResetExpires: timestamp("password_reset_expires", {
		withTimezone: true,
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

const SALT_ROUNDS = 10;

export class AuthModel implements IAuth {
	id?: number;
	username?: string;
	email?: string;
	password?: string;
	profilePicture?: string;
	createdAt?: Date;
	updatedAt?: Date;
	passwordResetToken?: string;
	passwordResetExpires?: Date;

	async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}

	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		return bcrypt.hash(password, salt);
	}
}

export type AuthRecord = typeof authTable.$inferSelect;
export type NewAuthRecord = typeof authTable.$inferInsert;
