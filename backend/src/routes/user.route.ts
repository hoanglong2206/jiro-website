import express, { Router } from "express";
import { verifyJWT } from "../helpers/auth.middleware";
import userController from "../controllers/user.controller";
import { validate } from "../helpers/validation.middleware";
import userSchema from "../schemas/user.schema";

class UserRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.patch(
			"/:userId",
			verifyJWT,
			validate(userSchema.updateUserSchema()),
			userController.updateUser,
		);
		this.router.get("/email/:email", verifyJWT, userController.getUserByEmail);
		this.router.get(
			"/username/:username",
			verifyJWT,
			userController.getUserByUsername,
		);
		this.router.get("/", verifyJWT, userController.getAllUsers);
		return this.router;
	}
}

export const userRoutes: UserRoutes = new UserRoutes();
