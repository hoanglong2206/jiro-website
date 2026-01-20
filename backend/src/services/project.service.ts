import { and, eq } from "drizzle-orm";
import { db } from "../database";
import {
	NewProjectMemberRecord,
	NewProjectRecord,
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
		user: IUser,
	): Promise<ProjectRecord> {
		return db.transaction(async (trx) => {
			const ownerEmail = user.email?.trim();
			const ownerFullname = user.fullname?.trim();

			if (!ownerEmail || !ownerFullname) {
				throw new Error("Owner information is incomplete");
			}

			const normalizedDescription =
				payload.description !== undefined && payload.description !== null
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

			const ownerProfilePicture =
				typeof user.profilePicture === "string"
					? user.profilePicture.trim() || null
					: null;
			const ownerColorAvatar =
				typeof user.colorAvatar === "string"
					? user.colorAvatar.trim() || null
					: null;

			const projectToInsert: NewProjectRecord = {
				name: payload.name.trim(),
				description: normalizedDescription,
				type: payload.type,
				accessLevel: payload.accessLevel,
				ownerId: user.id,
				ownerEmail,
				ownerFullname,
				ownerProfilePicture,
				ownerColorAvatar,
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

	async updateOwnerDetailsForUser(payload: {
		userId: string;
		fullname?: string;
		email?: string | null;
		profilePicture?: string | null;
		colorAvatar?: string | null;
	}): Promise<void> {
		const { userId } = payload;
		if (!userId) {
			return;
		}

		const normalizedFullname =
			payload.fullname !== undefined && payload.fullname !== null
				? payload.fullname.trim()
				: undefined;
		const normalizedEmail =
			payload.email !== undefined && payload.email !== null
				? payload.email.trim()
				: undefined;
		const ownerUpdates: Partial<NewProjectRecord> = {};
		if (normalizedFullname !== undefined && normalizedFullname.length) {
			ownerUpdates.ownerFullname = normalizedFullname;
		}
		if (normalizedEmail !== undefined && normalizedEmail.length) {
			ownerUpdates.ownerEmail = normalizedEmail;
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
		if (normalizedEmail !== undefined && normalizedEmail.length) {
			memberUpdates.userEmail = normalizedEmail;
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
			return;
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
