import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { projectService } from "../services/project.service";

class ProjectController {
	async createProject(req: Request, res: Response): Promise<Response> {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { name, description, type, icon, memberIds } = req.body;
			const project = await projectService.createProject({
				name,
				description,
				type,
				icon,
				leadId: req.currentUser.id,
				memberIds,
			});
			return res
				.status(StatusCodes.CREATED)
				.json({ message: "Project created", project });
		} catch (error: any) {
			const message = error?.message || "Unable to create project";
			const status = message.includes("not found")
				? StatusCodes.NOT_FOUND
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async getProjects(req: Request, res: Response): Promise<Response> {
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
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error?.message || "Unable to fetch projects" });
		}
	}

	async getProjectById(req: Request, res: Response): Promise<Response> {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			const project = await projectService.getProjectById(projectId);
			if (!project) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}
			const isMember = project.members?.some(
				(member) => member.id === req.currentUser?.id,
			);
			if (project.leadId !== req.currentUser.id && !isMember) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Access denied" });
			}
			return res.status(StatusCodes.OK).json({ project });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error?.message || "Unable to fetch project" });
		}
	}

	async updateProject(req: Request, res: Response): Promise<Response> {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			const existing = await projectService.getProjectById(projectId);
			if (!existing) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}
			if (existing.leadId !== req.currentUser.id) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Only the project lead can update this project" });
			}

			const { name, description, type, icon, memberIds } = req.body;
			const project = await projectService.updateProject(projectId, {
				name,
				description,
				type,
				icon,
				memberIds,
			});
			return res
				.status(StatusCodes.OK)
				.json({ message: "Project updated", project });
		} catch (error: any) {
			const message = error?.message || "Unable to update project";
			return res.status(StatusCodes.BAD_REQUEST).json({ message });
		}
	}

	async removeMember(req: Request, res: Response): Promise<Response> {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId, userId } = req.params;
			const existing = await projectService.getProjectById(projectId);
			if (!existing) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}
			if (existing.leadId !== req.currentUser.id) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Only the project lead can remove members" });
			}
			const project = await projectService.removeMember(projectId, userId);
			return res
				.status(StatusCodes.OK)
				.json({ message: "Member removed", project });
		} catch (error: any) {
			const message = error?.message || "Unable to remove member";
			const status = message.includes("not found")
				? StatusCodes.NOT_FOUND
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}

	async deleteProject(req: Request, res: Response): Promise<Response> {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { projectId } = req.params;
			const existing = await projectService.getProjectById(projectId);
			if (!existing) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Project not found" });
			}
			if (existing.leadId !== req.currentUser.id) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Only the project lead can delete this project" });
			}
			await projectService.deleteProject(projectId);
			return res.status(StatusCodes.NO_CONTENT).send();
		} catch (error: any) {
			const message = error?.message || "Unable to delete project";
			const status = message.includes("not found")
				? StatusCodes.NOT_FOUND
				: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}
}

export default new ProjectController();
