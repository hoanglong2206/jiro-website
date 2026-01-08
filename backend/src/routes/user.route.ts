import express, { Router } from "express";
import { verifyJWT } from "../helpers/auth.middleware";
import userController from "../controllers/user.controller";

class UserRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get(
			"/email/:email",
			verifyJWT,
			userController.getUserByEmail
		);
		this.router.get(
			"/username/:username",
			verifyJWT,
			userController.getUserByUsername
		);
		this.router.get("/", verifyJWT, userController.getAllUsers);
		return this.router;
	}
}

export const userRoutes: UserRoutes = new UserRoutes();
