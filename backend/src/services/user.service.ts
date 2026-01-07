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
		const existing = await this.getUserByEmail(payload.email!);
		if (existing) {
			throw new Error("Email already in use");
		}
		const toInsert: NewUserRecord = {
			username: payload.username!,
			email: payload.email!,
			profilePicture: payload.profilePicture!,
		};
		await db.insert(userTable).values(toInsert).returning();
	}
}

export const userService: UserService = new UserService();
