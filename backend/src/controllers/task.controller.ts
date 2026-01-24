import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { taskService } from "../services/task.service";

class TaskController {
	async createTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, boardId } = req.params;
			const { task } = req.body;

			if (!boardId || !projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Board ID and Project ID are required" });
			}

			const createdTask = await taskService.createTask(
				boardId,
				projectId,
				req.currentUser.id,
				task,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Task created successfully",
				task: createdTask,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to create task";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async getTasksByBoard(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, boardId } = req.params;

			if (!boardId || !projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Board ID and Project ID are required" });
			}

			const tasks = await taskService.getTasksByBoard(
				boardId,
				projectId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({ tasks });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch tasks";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async getTaskById(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			const task = await taskService.getTaskById(taskId, req.currentUser.id);

			if (!task) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Task not found" });
			}

			return res.status(StatusCodes.OK).json({ task });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch task";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async updateTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;
			const { task } = req.body;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			const updatedTask = await taskService.updateTask(
				taskId,
				req.currentUser.id,
				task,
			);

			return res.status(StatusCodes.OK).json({
				message: "Task updated successfully",
				task: updatedTask,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to update task";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async deleteTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			await taskService.deleteTask(taskId, req.currentUser.id);

			return res
				.status(StatusCodes.OK)
				.json({ message: "Task deleted successfully" });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to delete task";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async assignTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;
			const { assignee } = req.body;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			const taskAssignee = await taskService.assignTask(
				taskId,
				req.currentUser.id,
				assignee,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "User assigned to task successfully",
				assignee: taskAssignee,
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to assign user to task";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}

	async unassignTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId, userId } = req.params;

			if (!taskId || !userId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID and User ID are required" });
			}

			await taskService.unassignTask(taskId, userId, req.currentUser.id);

			return res
				.status(StatusCodes.OK)
				.json({ message: "User unassigned from task successfully" });
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to unassign user from task";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}

	async createComment(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;
			const { comment, user } = req.body;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			const createdComment = await taskService.createComment(
				taskId,
				user.id,
				user.fullname,
				user.profilePicture,
				comment,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Comment created successfully",
				comment: createdComment,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to create comment";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}

	async getCommentsByTask(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { taskId } = req.params;

			if (!taskId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Task ID is required" });
			}

			const comments = await taskService.getCommentsByTask(
				taskId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({ comments });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch comments";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async updateComment(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { commentId } = req.params;
			const { comment } = req.body;

			if (!commentId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Comment ID is required" });
			}

			const updatedComment = await taskService.updateComment(
				commentId,
				req.currentUser.id,
				comment,
			);

			return res.status(StatusCodes.OK).json({
				message: "Comment updated successfully",
				comment: updatedComment,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to update comment";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}

	async deleteComment(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { commentId } = req.params;

			if (!commentId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Comment ID is required" });
			}

			await taskService.deleteComment(commentId, req.currentUser.id);

			return res
				.status(StatusCodes.OK)
				.json({ message: "Comment deleted successfully" });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to delete comment";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}
}

export default new TaskController();
