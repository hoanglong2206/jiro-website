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
		this.router.get(
			"/",
			verifyJWT,
			projectController.getProjects.bind(projectController),
		);
		this.router.get(
			"/:projectId",
			verifyJWT,
			projectController.getProjectById.bind(projectController),
		);
		this.router.post(
			"/",
			verifyJWT,
			validate(schema.create()),
			projectController.createProject.bind(projectController),
		);
		this.router.put(
			"/:projectId",
			verifyJWT,
			validate(schema.update()),
			projectController.updateProject.bind(projectController),
		);
		this.router.delete(
			"/:projectId",
			verifyJWT,
			projectController.deleteProject.bind(projectController),
		);
		this.router.delete(
			"/:projectId/members/:userId",
			verifyJWT,
			projectController.removeMember.bind(projectController),
		);
		return this.router;
	}
}

export const projectRoutes: ProjectRoutes = new ProjectRoutes();
