import { and, eq } from "drizzle-orm";
import { db } from "../database";
import {
	NewProjectMemberRecord,
	NewProjectRecord,
	ProjectRecord,
	projectMembersTable,
	projectTable,
} from "../models/project.model";
import {
	ICreateProjectPayload,
	IUpdateProjectPayload,
} from "../types/project.interface";
import { IUser } from "../types/user.interface";

class ProjectService {
	async createProject(
		payload: ICreateProjectPayload,
		user: IUser,
	): Promise<ProjectRecord> {
		return db.transaction(async (trx) => {
			const normalizedDescription =
				payload.description !== undefined &&
				payload.description !== null
					? payload.description.trim() || null
					: null;
			const normalizedIcon =
				payload.icon !== undefined && payload.icon !== null
					? payload.icon.trim() || null
					: null;

			const normalizedColor =
				payload.color !== undefined && payload.color !== null
					? payload.color.trim() || null
					: null;

			const projectToInsert: NewProjectRecord = {
				name: payload.name.trim(),
				description: normalizedDescription,
				type: payload.type,
				accessLevel: payload.accessLevel,
				ownerId: user.id,
				ownerEmail: user.email,
				ownerFullname: user.fullname,
				ownerProfilePicture: user.profilePicture,
				ownerColorAvatar: user.colorAvatar,
				color: normalizedColor,
				icon: normalizedIcon,
			};

			const insertedProjects = await trx
				.insert(projectTable)
				.values(projectToInsert)
				.returning();

			const project = insertedProjects[0];
			if (!project) {
				throw new Error("Failed to create project");
			}

			const memberToInsert: NewProjectMemberRecord = {
				projectId: project.id!,
				userId: user.id,
				userEmail: user.email,
				userFullname: user.fullname,
				userProfilePicture: user.profilePicture,
				userColorAvatar: user.colorAvatar,
				role: "owner",
				invitedBy: user.id,
			};

			const insertedMembers = await trx
				.insert(projectMembersTable)
				.values(memberToInsert)
				.returning();

			const membership = insertedMembers[0];
			if (!membership) {
				throw new Error("Failed to add project member");
			}

			return project;
		});
	}

	async getProjectsForUser(userId: string): Promise<ProjectRecord[]> {
		const rows = await db
			.select({ project: projectTable })
			.from(projectMembersTable)
			.innerJoin(
				projectTable,
				eq(projectMembersTable.projectId, projectTable.id),
			)
			.where(eq(projectMembersTable.userId, userId));

		return rows.map((row) => row.project);
	}

	async getProjectByIdForUser(
		projectId: string,
		userId: string,
	): Promise<ProjectRecord | null> {
		const rows = await db
			.select({ project: projectTable })
			.from(projectMembersTable)
			.innerJoin(
				projectTable,
				eq(projectMembersTable.projectId, projectTable.id),
			)
			.where(
				and(
					eq(projectMembersTable.projectId, projectId),
					eq(projectMembersTable.userId, userId),
				),
			)
			.limit(1);

		return rows[0]?.project ?? null;
	}

	async updateProject(
		projectId: string,
		userId: string,
		payload: IUpdateProjectPayload,
	): Promise<ProjectRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		return db.transaction(async (trx) => {
			const membership = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const member = membership[0];
			if (!member) {
				throw new Error("You are not a member of this project");
			}

			if (member.role !== "owner" && member.role !== "admin") {
				throw new Error(
					"You do not have permission to update this project",
				);
			}

			const updates: Partial<NewProjectRecord> = {};

			if (payload.name !== undefined) {
				const name = payload.name.trim();
				updates.name = name;
			}

			if (payload.description !== undefined) {
				const description = payload.description?.trim();
				updates.description = description ? description : null;
			}

			if (payload.type !== undefined) {
				updates.type = payload.type;
			}

			if (payload.accessLevel !== undefined) {
				updates.accessLevel = payload.accessLevel;
			}

			if (payload.color !== undefined) {
				updates.color = payload.color || null;
			}

			if (payload.icon !== undefined) {
				updates.icon =
					payload.icon !== null ? payload.icon.trim() || null : null;
			}

			if (!Object.keys(updates).length) {
				throw new Error("No fields to update");
			}

			const updatedProjects = await trx
				.update(projectTable)
				.set({
					...updates,
					updatedAt: new Date(),
				})
				.where(eq(projectTable.id, projectId))
				.returning();

			const updatedProject = updatedProjects[0];
			if (!updatedProject) {
				throw new Error("Failed to update project");
			}

			return updatedProject;
		});
	}

	async updateOwnerDetailsForUser(payload: {
		userId: string;
		fullname?: string;
		profilePicture?: string;
		colorAvatar?: string;
	}): Promise<void> {
		const { userId } = payload;
		if (!userId) {
			return;
		}

		const normalizedFullname =
			payload.fullname !== undefined && payload.fullname !== null
				? payload.fullname.trim()
				: undefined;
		const ownerUpdates: Partial<NewProjectRecord> = {};
		if (normalizedFullname !== undefined && normalizedFullname.length) {
			ownerUpdates.ownerFullname = normalizedFullname;
		}
		if (payload.profilePicture !== undefined) {
			ownerUpdates.ownerProfilePicture = payload.profilePicture ?? null;
		}
		if (payload.colorAvatar !== undefined) {
			ownerUpdates.ownerColorAvatar = payload.colorAvatar ?? null;
		}

		const memberUpdates: Partial<NewProjectMemberRecord> = {};
		if (normalizedFullname !== undefined && normalizedFullname.length) {
			memberUpdates.userFullname = normalizedFullname;
		}
		if (payload.profilePicture !== undefined) {
			memberUpdates.userProfilePicture = payload.profilePicture ?? null;
		}
		if (payload.colorAvatar !== undefined) {
			memberUpdates.userColorAvatar = payload.colorAvatar ?? null;
		}

		if (
			!Object.keys(ownerUpdates).length &&
			!Object.keys(memberUpdates).length
		) {
			throw new Error("No fields to update");
		}

		await db.transaction(async (trx) => {
			if (Object.keys(ownerUpdates).length) {
				await trx
					.update(projectTable)
					.set(ownerUpdates)
					.where(eq(projectTable.ownerId, userId));
			}

			if (Object.keys(memberUpdates).length) {
				await trx
					.update(projectMembersTable)
					.set(memberUpdates)
					.where(eq(projectMembersTable.userId, userId));
			}
		});
	}
}

export const projectService: ProjectService = new ProjectService();
