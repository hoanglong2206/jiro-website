import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { projectService } from "../services/project.service";

class ProjectController {
	async createProject(req: Request, res: Response) {
		try {
			const { name, description, type, accessLevel, color, icon, user } =
				req.body;
			console.log(req.body);
			const result = await projectService.createProject(
				{
					name,
					description: description ?? null,
					type,
					accessLevel,
					color: color ?? null,
					icon: icon ?? null,
				},
				user
			);

			return res.status(StatusCodes.CREATED).json({
				message: "Project created successfully",
				project: result.project,
				membership: result.membership,
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to create project";
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
				req.currentUser.id
			);
			return res.status(StatusCodes.OK).json({ projects });
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to fetch projects";
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message });
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
				req.currentUser.id
			);

			if (!project) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}

			return res.status(StatusCodes.OK).json(project);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to fetch project";
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message });
		}
	}
}

export default new ProjectController();
