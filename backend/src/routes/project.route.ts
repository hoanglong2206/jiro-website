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
		this.router.get("/getAll", verifyJWT, projectController.getProjects);
		this.router.get(
			"/:projectId",
			verifyJWT,
			projectController.getProjectById,
		);
		this.router.post(
			"/create",
			verifyJWT,
			validate(schema.create()),
			projectController.createProject,
		);
		this.router.patch(
			"/:projectId",
			verifyJWT,
			validate(schema.update()),
			projectController.updateProject,
		);
		return this.router;
	}
}

export const projectRoutes: ProjectRoutes = new ProjectRoutes();
