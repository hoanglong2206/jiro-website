import { db } from "../database";
import { userTable, UserRecord, NewUserRecord } from "../models/user.model";
import { eq } from "drizzle-orm";
import { IUser } from "../types/user.interface";

class UserService {
	constructor() {}

	async getUserByEmail(email: string): Promise<UserRecord | null> {
		const rows = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, email))
			.limit(1);
		return rows[0];
	}

	async getUserByUsername(username: string): Promise<UserRecord | null> {
		const rows = await db
			.select()
			.from(userTable)
			.where(eq(userTable.username, username))
			.limit(1);
		return rows[0];
	}

	async getAllUsers(): Promise<UserRecord[]> {
		const rows = await db.select().from(userTable);
		return rows;
	}

	async createUser(payload: IUser): Promise<void> {
		const existingEmail = await this.getUserByEmail(payload.email!);
		const existingUsername = await this.getUserByUsername(payload.username!);
		if (existingUsername) {
			throw new Error("Username already in use");
		}
		if (existingEmail) {
			throw new Error("Email already in use");
		}
		const toInsert: NewUserRecord = {
			fullname: payload.fullname!,
			username: payload.username!,
			email: payload.email!,
			profilePicture: payload.profilePicture ?? null,
		};
		await db.insert(userTable).values(toInsert).returning();
	}
}

export const userService: UserService = new UserService();
