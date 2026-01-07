import express, { Router } from "express";
import userController from "../controllers/user.controller";

class UserRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get("/email/:email", userController.getUserByEmail);
		this.router.get(
			"/username/:username",
			userController.getUserByUsername
		);
		this.router.get("/", userController.getAllUsers);
		return this.router;
	}
}

export const userRoutes: UserRoutes = new UserRoutes();
