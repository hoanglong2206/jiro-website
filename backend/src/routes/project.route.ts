import express, { Router } from "express";
import projectController from "../controllers/project.controller";
import { verifyJWT } from "../helpers/auth.middleware";
import { validate } from "../helpers/validation.middleware";
import schema from "../schemas/project.schema";

class ProjectRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	routes(): Router {
		return this.router;
	}
}

export const projectRoutes: ProjectRoutes = new ProjectRoutes();
