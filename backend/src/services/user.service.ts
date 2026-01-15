import { db } from "../database";
import { userTable, UserRecord, NewUserRecord } from "../models/user.model";
import { eq } from "drizzle-orm";
import { IUser } from "../types/user.interface";
import { uploads } from "../helpers/cloudinaryUpload";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

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

	async getUserById(id: string): Promise<UserRecord | null> {
		const rows = await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, id))
			.limit(1);
		return rows[0];
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
			id: payload.id,
			fullname: payload.fullname!,
			username: payload.username!,
			email: payload.email!,
			profilePicture: payload.profilePicture ?? null,
			colorAvatar: payload.colorAvatar ?? null,
			jobTitle: payload.jobTitle ?? null,
		};
		await db.insert(userTable).values(toInsert).returning();
	}

	async updateUser(
		userId: string,
		payload: Partial<
			Pick<IUser, "fullname" | "profilePicture" | "colorAvatar" | "jobTitle">
		> & { profilePicture?: string | null },
	): Promise<UserRecord> {
		const existingUser = await this.getUserById(userId);
		if (!existingUser) {
			throw new Error("User not found");
		}

		const updateData: Partial<UserRecord> = {};

		if (payload.fullname !== undefined) {
			const trimmedName = payload.fullname.trim();
			updateData.fullname = trimmedName;
		}

		if (payload.colorAvatar !== undefined) {
			updateData.colorAvatar = payload.colorAvatar || null;
		}

		if (payload.jobTitle !== undefined) {
			const trimmedJob = payload.jobTitle?.trim();
			updateData.jobTitle = trimmedJob ? trimmedJob : null;
		}

		if (payload.profilePicture !== undefined) {
			if (!payload.profilePicture) {
				updateData.profilePicture = null;
			} else if (payload.profilePicture.startsWith("http")) {
				updateData.profilePicture = payload.profilePicture;
			} else {
				const uploadResult = await uploads(
					payload.profilePicture,
					`users/${userId}`,
					true,
					true,
				);

				if (!uploadResult) {
					throw new Error("Failed to upload profile picture");
				}

				if (this.isUploadSuccess(uploadResult)) {
					updateData.profilePicture = uploadResult.secure_url;
				} else {
					throw new Error(
						uploadResult.message || "Failed to upload profile picture",
					);
				}
			}
		}

		if (!Object.keys(updateData).length) {
			return existingUser;
		}

		const rows = await db
			.update(userTable)
			.set(updateData)
			.where(eq(userTable.id, userId))
			.returning();

		const updatedUser = rows[0];
		if (!updatedUser) {
			throw new Error("User not found");
		}

		return updatedUser;
	}

	private isUploadSuccess(
		result: UploadApiResponse | UploadApiErrorResponse | undefined,
	): result is UploadApiResponse {
		return Boolean(result && "secure_url" in result);
	}
}

export const userService: UserService = new UserService();
