import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../helpers/validation.middleware";
import scheme from "../schemas/auth.schema";
import { verifyJWT, verifyRefreshJWT } from "../helpers/auth.middleware";

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}
	public routes(): Router {
		this.router.post(
			"/register",
			validate(scheme.registerSchema()),
			authController.register.bind(authController),
		);
		this.router.post(
			"/login",
			validate(scheme.loginSchema()),
			authController.login.bind(authController),
		);
		this.router.post("/logout", authController.logout.bind(authController));
		this.router.get("/me", verifyJWT, authController.me.bind(authController));
		this.router.get(
			"/refresh-token/:username",
			verifyRefreshJWT,
			authController.refreshToken.bind(authController),
		);
		this.router.put(
			"/change-password",
			verifyJWT,
			validate(scheme.changePasswordSchema()),
			authController.changePassword.bind(authController),
		);
		return this.router;
	}
}
export const authRoutes: AuthRoutes = new AuthRoutes();
