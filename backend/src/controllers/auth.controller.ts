import { StatusCodes } from "http-status-codes";
import { CookieOptions, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { config } from "../config";

const refreshCookieOptions: CookieOptions = {
	httpOnly: true,
	sameSite: "lax",
	secure: config.NODE_ENV === "production",
	maxAge: 1000 * 60 * 3,
};

class AuthController {
	async register(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const result = await authService.register({ username, email, password });
			res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
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
			res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
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

	async logout(_req: Request, res: Response) {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			sameSite: "lax",
			secure: config.NODE_ENV === "production",
		});
		return res.status(StatusCodes.OK).json({ message: "Logged out" });
	}

	async me(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}
		return res.status(StatusCodes.OK).json({ user: req.currentUser });
	}

	async refreshToken(req: Request, res: Response) {
		try {
			const username = req.params.username;
			const user = await authService.findByUsername(username);
			if (!user) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized" });
			}
			const token = authService.signToken({
				id: user.id!,
				username: user.username!,
				email: user.email!,
			});
			return res.status(StatusCodes.OK).json({ token });
		} catch (error: any) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: error?.message || "Unauthorized" });
		}
	}
}

export default new AuthController();
