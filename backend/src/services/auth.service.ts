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

	async register(payload: {
		username: string;
		email: string;
		password: string;
	}): Promise<{ user: Omit<AuthRecord, "password">; token: string }> {
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
		const { password, ...safe } = user;
		return { user: safe, token };
	}

	async login(payload: {
		email: string;
		password: string;
	}): Promise<{ user: Omit<AuthRecord, "password">; token: string }> {
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
		const { password, ...safe } = user;
		return { user: safe, token };
	}

	signToken(payload: IAuthPayload): string {
		return jwt.sign(payload, config.JWT_SECRET as string, { expiresIn: "7d" });
	}
}

export const authService: AuthService = new AuthService();
