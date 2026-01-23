import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { projectService } from "../services/project.service";

class ProjectController {
	async createProject(req: Request, res: Response) {
		try {
			const { name, description, type, accessLevel, color, icon, user } =
				req.body;
			console.log(req.body);
			const project = await projectService.createProject(
				{
					name,
					description: description ?? null,
					type,
					accessLevel,
					color: color ?? null,
					icon: icon ?? null,
				},
				user,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Project created successfully",
				project,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to create project";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async updateProject(req: Request, res: Response) {
		try {
			const { projectId } = req.params;
			const { userId, project } = req.body;

			const projectUpdate = await projectService.updateProject(
				projectId,
				userId,
				project,
			);

			return res.status(StatusCodes.OK).json({
				message: "Project updated successfully",
				project: projectUpdate,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to update project";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async getProjects(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const projects = await projectService.getProjectsForUser(
				req.currentUser.id,
			);
			return res.status(StatusCodes.OK).json({ projects });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch projects";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async getProjectById(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			if (!projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id is required" });
			}

			const project = await projectService.getProjectByIdForUser(
				projectId,
				req.currentUser.id,
			);

			if (!project) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}

			return res.status(StatusCodes.OK).json({ project });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch project";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async getWorkspaces(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			if (!projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project ID is required" });
			}

			const workspaces = await projectService.getWorkspacesForProject(
				projectId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({ workspaces });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch workspaces";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async getWorkspaceById(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId } = req.params;
			if (!projectId || !workspaceId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project ID and Workspace ID are required" });
			}

			const workspace = await projectService.getWorkspaceById(
				projectId,
				workspaceId,
				req.currentUser.id,
			);

			if (!workspace) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Workspace not found" });
			}

			return res.status(StatusCodes.OK).json({ workspace });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch workspace";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async createWorkspace(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			if (!projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id is required" });
			}

			const { workspace } = req.body;
			if (!workspace) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Workspace payload is required" });
			}

			const createdWorkspace = await projectService.createWorkspace(
				projectId,
				req.currentUser.id,
				workspace,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Workspace created successfully",
				workspace: createdWorkspace,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to create workspace";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async updateWorkspace(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId } = req.params;
			if (!projectId || !workspaceId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id and workspace id are required" });
			}

			const { workspace } = req.body;
			if (!workspace) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Workspace payload is required" });
			}

			const updatedWorkspace = await projectService.updateWorkspace(
				projectId,
				workspaceId,
				req.currentUser.id,
				workspace,
			);

			return res.status(StatusCodes.OK).json({
				message: "Workspace updated successfully",
				workspace: updatedWorkspace,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to update workspace";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async getBoards(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId } = req.params;
			if (!projectId || !workspaceId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project ID and Workspace ID are required" });
			}

			const boards = await projectService.getBoardsForWorkspace(
				projectId,
				workspaceId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({ boards });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch boards";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async getBoardById(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId, boardId } = req.params;
			if (!projectId || !workspaceId || !boardId) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Project ID, Workspace ID and Board ID are required",
				});
			}

			const board = await projectService.getBoardById(
				projectId,
				workspaceId,
				boardId,
				req.currentUser.id,
			);

			if (!board) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Board not found" });
			}

			return res.status(StatusCodes.OK).json({ board });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to fetch board";
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
		}
	}

	async createBoard(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId } = req.params;
			if (!projectId || !workspaceId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id and workspace id are required" });
			}

			const { board } = req.body;
			if (!board) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Board payload is required" });
			}

			const createdBoard = await projectService.createBoard(
				projectId,
				workspaceId,
				req.currentUser.id,
				board,
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Board created successfully",
				board: createdBoard,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to create board";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async updateBoard(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId, boardId } = req.params;
			if (!projectId || !workspaceId || !boardId) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Project id, workspace id, and board id are required",
				});
			}

			const { board } = req.body;
			if (!board) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Board payload is required" });
			}

			const updatedBoard = await projectService.updateBoard(
				projectId,
				workspaceId,
				boardId,
				req.currentUser.id,
				board,
			);

			return res.status(StatusCodes.OK).json({
				message: "Board updated successfully",
				board: updatedBoard,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to update board";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async deleteProject(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			if (!projectId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id is required" });
			}

			const deletedProject = await projectService.deleteProject(
				projectId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({
				message: "Project deleted successfully",
				project: deletedProject,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to delete project";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async deleteWorkspace(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId } = req.params;
			if (!projectId || !workspaceId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Project id and workspace id are required" });
			}

			const deletedWorkspace = await projectService.deleteWorkspace(
				projectId,
				workspaceId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({
				message: "Workspace deleted successfully",
				workspace: deletedWorkspace,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to delete workspace";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async deleteBoard(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, workspaceId, boardId } = req.params;
			if (!projectId || !workspaceId || !boardId) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Project id, workspace id, and board id are required",
				});
			}

			const deletedBoard = await projectService.deleteBoard(
				projectId,
				workspaceId,
				boardId,
				req.currentUser.id,
			);

			return res.status(StatusCodes.OK).json({
				message: "Board deleted successfully",
				board: deletedBoard,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to delete board";
			const status = message.startsWith("Failed to")
				? StatusCodes.INTERNAL_SERVER_ERROR
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}
}

export default new ProjectController();
