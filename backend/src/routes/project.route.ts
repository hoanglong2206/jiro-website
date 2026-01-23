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
		this.router.get("/:projectId", verifyJWT, projectController.getProjectById);
		this.router.post(
			"/create",
			verifyJWT,
			validate(schema.createProject()),
			projectController.createProject,
		);
		this.router.patch(
			"/:projectId",
			verifyJWT,
			validate(schema.updateProject()),
			projectController.updateProject,
		);
		this.router.delete(
			"/:projectId",
			verifyJWT,
			projectController.deleteProject,
		);
		this.router.get(
			"/:projectId/workspaces",
			verifyJWT,
			projectController.getWorkspaces,
		);
		this.router.get(
			"/:projectId/workspaces/:workspaceId",
			verifyJWT,
			projectController.getWorkspaceById,
		);
		this.router.post(
			"/:projectId/workspaces",
			verifyJWT,
			validate(schema.createWorkspace()),
			projectController.createWorkspace,
		);
		this.router.patch(
			"/:projectId/workspaces/:workspaceId",
			verifyJWT,
			validate(schema.updateWorkspace()),
			projectController.updateWorkspace,
		);
		this.router.delete(
			"/:projectId/workspaces/:workspaceId",
			verifyJWT,
			projectController.deleteWorkspace,
		);
		this.router.get(
			"/:projectId/workspaces/:workspaceId/boards",
			verifyJWT,
			projectController.getBoards,
		);
		this.router.get(
			"/:projectId/workspaces/:workspaceId/boards/:boardId",
			verifyJWT,
			projectController.getBoardById,
		);
		this.router.post(
			"/:projectId/workspaces/:workspaceId/boards",
			verifyJWT,
			validate(schema.createBoard()),
			projectController.createBoard,
		);
		this.router.patch(
			"/:projectId/workspaces/:workspaceId/boards/:boardId",
			verifyJWT,
			validate(schema.updateBoard()),
			projectController.updateBoard,
		);
		this.router.delete(
			"/:projectId/workspaces/:workspaceId/boards/:boardId",
			verifyJWT,
			projectController.deleteBoard,
		);
		return this.router;
	}
}

export const projectRoutes: ProjectRoutes = new ProjectRoutes();
