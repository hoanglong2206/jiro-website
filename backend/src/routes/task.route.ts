import express, { Router } from "express";
import taskController from "../controllers/task.controller";
import { verifyJWT } from "../helpers/auth.middleware";
import { validate } from "../helpers/validation.middleware";
import schema from "../schemas/task.schema";

class TaskRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	routes(): Router {
		// Task CRUD operations
		this.router.post(
			"/:projectId/boards/:boardId/tasks",
			verifyJWT,
			validate(schema.createTask()),
			taskController.createTask,
		);

		this.router.get(
			"/:projectId/boards/:boardId/tasks",
			verifyJWT,
			taskController.getTasksByBoard,
		);

		this.router.get("/tasks/:taskId", verifyJWT, taskController.getTaskById);

		this.router.patch(
			"/tasks/:taskId",
			verifyJWT,
			validate(schema.updateTask()),
			taskController.updateTask,
		);

		this.router.delete("/tasks/:taskId", verifyJWT, taskController.deleteTask);

		// Task assignment
		this.router.post(
			"/tasks/:taskId/assign",
			verifyJWT,
			validate(schema.assignTask()),
			taskController.assignTask,
		);

		this.router.delete(
			"/tasks/:taskId/assign/:userId",
			verifyJWT,
			taskController.unassignTask,
		);

		// Task comments
		this.router.post(
			"/tasks/:taskId/comments",
			verifyJWT,
			validate(schema.createComment()),
			taskController.createComment,
		);

		this.router.get(
			"/tasks/:taskId/comments",
			verifyJWT,
			taskController.getCommentsByTask,
		);

		this.router.patch(
			"/comments/:commentId",
			verifyJWT,
			validate(schema.updateComment()),
			taskController.updateComment,
		);

		this.router.delete(
			"/comments/:commentId",
			verifyJWT,
			taskController.deleteComment,
		);

		return this.router;
	}
}

export const taskRoutes: TaskRoutes = new TaskRoutes();
