import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { authService } from "../services/auth.service";

class AuthController {
	async register(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const result = await authService.register({ username, email, password });
			return res.status(StatusCodes.CREATED).json({
				message: "Registered successfully",
				user: result.user,
				token: result.token,
			});
		} catch (error: any) {
			const message = error?.message || "Registration failed";
			const status = message.includes("Email")
				? StatusCodes.CONFLICT
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const result = await authService.login({ email, password });
			return res.status(StatusCodes.OK).json({
				message: "Logged in successfully",
				user: result.user,
				token: result.token,
			});
		} catch (error: any) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: error?.message || "Invalid credentials" });
		}
	}

	async me(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}
		return res.status(StatusCodes.OK).json({ user: req.currentUser });
	}

	async logout(_req: Request, res: Response) {
		return res.status(StatusCodes.OK).json({ message: "Logged out" });
	}
}

export default new AuthController();
