import express, { Router } from "express";
import { verifyJWT } from "../helpers/auth.middleware";

class FriendRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		return this.router;
	}
}

export const friendRoutes: FriendRoutes = new FriendRoutes();
