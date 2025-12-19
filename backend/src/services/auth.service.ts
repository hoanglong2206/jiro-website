import { db } from "../database";
import {
	authTable,
	AuthModel,
	AuthRecord,
	NewAuthRecord,
} from "../models/auth.model";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IAuthPayload } from "../types/auth.interface";

class AuthService {
	private authModel: AuthModel;

	constructor() {
		this.authModel = new AuthModel();
	}

	async findByEmail(email: string): Promise<AuthRecord | undefined> {
		const rows = await db
			.select()
			.from(authTable)
			.where(eq(authTable.email, email))
			.limit(1);
		return rows[0];
	}

	async findById(id: number): Promise<AuthRecord | undefined> {
		const rows = await db
			.select()
			.from(authTable)
			.where(eq(authTable.id, id))
			.limit(1);
		return rows[0];
	}

	async findByUsername(username: string): Promise<AuthRecord | undefined> {
		const rows = await db
			.select()
			.from(authTable)
			.where(eq(authTable.username, username))
			.limit(1);
		return rows[0];
	}

	async register(payload: {
		username: string;
		email: string;
		password: string;
	}): Promise<{
		user: Omit<AuthRecord, "password">;
		token: string;
		refreshToken: string;
	}> {
		const existing = await this.findByEmail(payload.email);
		if (existing) {
			throw new Error("Email already in use");
		}

		const hashed = await this.authModel.hashPassword(payload.password);
		const toInsert: NewAuthRecord = {
			username: payload.username,
			email: payload.email,
			password: hashed,
		};
		const inserted = await db.insert(authTable).values(toInsert).returning();
		const user = inserted[0];
		const token = this.signToken({
			id: user.id!,
			username: user.username!,
			email: user.email!,
		});

		const refreshToken = this.signRefreshToken({
			id: user.id!,
			username: user.username!,
			email: user.email!,
		});

		const { password, ...safe } = user;
		return { user: safe, token, refreshToken };
	}

	async login(payload: { email: string; password: string }): Promise<{
		user: Omit<AuthRecord, "password">;
		token: string;
		refreshToken: string;
	}> {
		const user = await this.findByEmail(payload.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}
		const match = await this.authModel.comparePassword(
			payload.password,
			user.password!,
		);
		if (!match) {
			throw new Error("Invalid credentials");
		}
		const token = this.signToken({
			id: user.id!,
			username: user.username!,
			email: user.email!,
		});

		const refreshToken = this.signRefreshToken({
			id: user.id!,
			username: user.username!,
			email: user.email!,
		});

		const { password, ...safe } = user;
		return { user: safe, token, refreshToken };
	}

	signToken(payload: IAuthPayload): string {
		return jwt.sign(payload, config.JWT_SECRET as string, { expiresIn: "2d" });
	}

	signRefreshToken(payload: IAuthPayload): string {
		return jwt.sign(payload, config.JWT_SECRET as string, {
			expiresIn: "3d",
		});
	}

	async changePassword(payload: {
		userId: number;
		currentPassword: string;
		newPassword: string;
	}): Promise<{
		user: Omit<AuthRecord, "password">;
		token: string;
		refreshToken: string;
	}> {
		const user = await this.findById(payload.userId);
		if (!user) {
			throw new Error("User not found");
		}

		const matched = await this.authModel.comparePassword(
			payload.currentPassword,
			user.password!,
		);
		if (!matched) {
			throw new Error("Current password is incorrect");
		}

		const isSamePassword = await this.authModel.comparePassword(
			payload.newPassword,
			user.password!,
		);
		if (isSamePassword) {
			throw new Error(
				"New password must be different from the current password",
			);
		}

		const hashed = await this.authModel.hashPassword(payload.newPassword);
		const updated = await db
			.update(authTable)
			.set({ password: hashed })
			.where(eq(authTable.id, payload.userId))
			.returning();
		const updatedUser = updated[0];
		if (!updatedUser) {
			throw new Error("Password update failed");
		}

		const token = this.signToken({
			id: updatedUser.id!,
			username: updatedUser.username!,
			email: updatedUser.email!,
		});
		const refreshToken = this.signRefreshToken({
			id: updatedUser.id!,
			username: updatedUser.username!,
			email: updatedUser.email!,
		});

		const { password, ...safe } = updatedUser;
		return { user: safe, token, refreshToken };
	}
}

export const authService: AuthService = new AuthService();
