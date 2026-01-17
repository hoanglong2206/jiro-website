import { and, eq } from "drizzle-orm";
import { db } from "../database";
import {
	NewProjectMemberRecord,
	NewProjectRecord,
	ProjectMemberRecord,
	ProjectRecord,
	projectMembersTable,
	projectTable,
} from "../models/project.model";
import { ProjectAccessLevel, ProjectType } from "../types/project.interface";
import { IUser } from "../types/user.interface";

type CreateProjectPayload = {
	name: string;
	description?: string | null;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	color?: string | null;
	icon?: string | null;
};

class ProjectService {
	async createProject(
		payload: CreateProjectPayload,
		user: IUser
	): Promise<{ project: ProjectRecord; membership: ProjectMemberRecord }> {
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
				userProfilePicture: user.profilePicture ?? null,
				userColorAvatar: user.colorAvatar ?? null,
				role: "admin",
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

			return { project, membership };
		});
	}

	async getProjectsForUser(
		userId: string
	): Promise<
		Array<{ project: ProjectRecord; membership: ProjectMemberRecord }>
	> {
		const rows = await db
			.select({ project: projectTable, membership: projectMembersTable })
			.from(projectMembersTable)
			.innerJoin(
				projectTable,
				eq(projectMembersTable.projectId, projectTable.id)
			)
			.where(eq(projectMembersTable.userId, userId));

		return rows;
	}

	async getProjectByIdForUser(
		projectId: string,
		userId: string
	): Promise<{
		project: ProjectRecord;
		membership: ProjectMemberRecord;
	} | null> {
		const rows = await db
			.select({ project: projectTable, membership: projectMembersTable })
			.from(projectMembersTable)
			.innerJoin(
				projectTable,
				eq(projectMembersTable.projectId, projectTable.id)
			)
			.where(
				and(
					eq(projectMembersTable.projectId, projectId),
					eq(projectMembersTable.userId, userId)
				)
			)
			.limit(1);

		return rows[0] ?? null;
	}
}

export const projectService: ProjectService = new ProjectService();
