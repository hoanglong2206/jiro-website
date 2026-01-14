import { and, eq, inArray } from "drizzle-orm";
import { db } from "../database";
import {
	NewProjectMemberRecord,
	NewProjectRecord,
	ProjectRecord,
	projectMemberTable,
	projectTable,
} from "../models/project.model";
import { userTable } from "../models/user.model";
import {
	ICreateProjectPayload,
	IProjectWithRelations,
	IUpdateProjectPayload,
} from "../types/project.interface";

interface ProjectQueryRow {
	project: ProjectRecord;
	lead: typeof userTable.$inferSelect | null;
}

interface MemberQueryRow {
	member: typeof userTable.$inferSelect;
}

class ProjectService {
	private async fetchProjectRowById(
		projectId: string,
	): Promise<ProjectQueryRow | null> {
		const rows = await db
			.select({ project: projectTable, lead: userTable })
			.from(projectTable)
			.leftJoin(userTable, eq(projectTable.leadId, userTable.id))
			.where(eq(projectTable.id, projectId))
			.limit(1);
		return rows[0] ?? null;
	}

	private async fetchProjectMembers(
		projectId: string,
	): Promise<MemberQueryRow[]> {
		return db
			.select({ member: userTable })
			.from(projectMemberTable)
			.innerJoin(userTable, eq(projectMemberTable.userId, userTable.id))
			.where(eq(projectMemberTable.projectId, projectId));
	}

	private formatProjectResponse(
		row: ProjectQueryRow,
		members: MemberQueryRow[],
	): IProjectWithRelations {
		const { project, lead } = row;
		return {
			id: project.id!,
			name: project.name!,
			description: project.description ?? null,
			type: project.type!,
			leadId: project.leadId!,
			icon: project.icon ?? null,
			createdAt: project.createdAt!,
			updatedAt: project.updatedAt!,
			lead: lead ? { ...lead } : null,
			members: members.map((item) => ({ ...item.member })),
		};
	}

	private normalizeMemberIds(leadId: string, memberIds?: string[]): string[] {
		if (!memberIds?.length) {
			return [];
		}
		const unique = new Set(memberIds.filter(Boolean));
		unique.delete(leadId);
		return Array.from(unique);
	}

	private async validateUsersExist(userIds: string[]): Promise<void> {
		if (!userIds.length) {
			return;
		}
		const rows = await db
			.select({ id: userTable.id })
			.from(userTable)
			.where(inArray(userTable.id, userIds));
		if (rows.length !== userIds.length) {
			throw new Error("One or more users not found");
		}
	}

	private async upsertMembers(
		projectId: string,
		memberIds: string[],
	): Promise<void> {
		await db
			.delete(projectMemberTable)
			.where(eq(projectMemberTable.projectId, projectId));
		if (!memberIds.length) {
			return;
		}
		const payload: NewProjectMemberRecord[] = memberIds.map((userId) => ({
			projectId,
			userId,
		}));
		await db.insert(projectMemberTable).values(payload);
	}

	private async ensureLeadExists(leadId: string): Promise<void> {
		const rows = await db
			.select({ id: userTable.id })
			.from(userTable)
			.where(eq(userTable.id, leadId))
			.limit(1);
		if (!rows.length) {
			throw new Error("Lead user not found");
		}
	}

	async createProject(
		payload: ICreateProjectPayload,
	): Promise<IProjectWithRelations> {
		await this.ensureLeadExists(payload.leadId);
		const memberIds = this.normalizeMemberIds(
			payload.leadId,
			payload.memberIds,
		);
		await this.validateUsersExist(memberIds);

		const toInsert: NewProjectRecord = {
			name: payload.name,
			description: payload.description,
			type: payload.type,
			leadId: payload.leadId,
			icon: payload.icon,
		};
		const inserted = await db.insert(projectTable).values(toInsert).returning();
		const project = inserted[0];
		if (!project?.id) {
			throw new Error("Unable to create project");
		}
		await this.upsertMembers(project.id, memberIds);
		const row = await this.fetchProjectRowById(project.id);
		if (!row) {
			throw new Error("Project not found after creation");
		}
		const members = await this.fetchProjectMembers(project.id);
		return this.formatProjectResponse(row, members);
	}

	async getProjectById(
		projectId: string,
	): Promise<IProjectWithRelations | null> {
		const row = await this.fetchProjectRowById(projectId);
		if (!row) {
			return null;
		}
		const members = await this.fetchProjectMembers(projectId);
		return this.formatProjectResponse(row, members);
	}

	async getProjectsForUser(userId: string): Promise<IProjectWithRelations[]> {
		const leadProjects = await db
			.select({ project: projectTable })
			.from(projectTable)
			.where(eq(projectTable.leadId, userId));

		const memberProjectRows = await db
			.select({ projectId: projectMemberTable.projectId })
			.from(projectMemberTable)
			.where(eq(projectMemberTable.userId, userId));

		const projectIds = new Set<string>();
		leadProjects.forEach((row) => {
			if (row.project.id) {
				projectIds.add(row.project.id);
			}
		});
		memberProjectRows.forEach((row) => {
			if (row.projectId) {
				projectIds.add(row.projectId);
			}
		});

		if (!projectIds.size) {
			return [];
		}

		const rows = await db
			.select({ project: projectTable, lead: userTable })
			.from(projectTable)
			.leftJoin(userTable, eq(projectTable.leadId, userTable.id))
			.where(inArray(projectTable.id, Array.from(projectIds)));

		const projects = await Promise.all(
			rows.map(async (row) => {
				const members = await this.fetchProjectMembers(row.project.id!);
				return this.formatProjectResponse(row, members);
			}),
		);

		return projects.sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
		);
	}

	async updateProject(
		projectId: string,
		payload: IUpdateProjectPayload,
	): Promise<IProjectWithRelations> {
		const row = await this.fetchProjectRowById(projectId);
		if (!row) {
			throw new Error("Project not found");
		}

		const updates: Partial<NewProjectRecord> = {};
		if (payload.name !== undefined) {
			updates.name = payload.name;
		}
		if (payload.description !== undefined) {
			updates.description = payload.description;
		}
		if (payload.type !== undefined) {
			updates.type = payload.type;
		}
		if (payload.icon !== undefined) {
			updates.icon = payload.icon;
		}

		if (Object.keys(updates).length) {
			await db
				.update(projectTable)
				.set(updates)
				.where(eq(projectTable.id, projectId));
		}

		if (payload.memberIds !== undefined) {
			const memberIds = this.normalizeMemberIds(
				row.project.leadId!,
				payload.memberIds,
			);
			await this.validateUsersExist(memberIds);
			await this.upsertMembers(projectId, memberIds);
		}

		const updated = await this.fetchProjectRowById(projectId);
		if (!updated) {
			throw new Error("Project not found after update");
		}
		const members = await this.fetchProjectMembers(projectId);
		return this.formatProjectResponse(updated, members);
	}

	async removeMember(
		projectId: string,
		userId: string,
	): Promise<IProjectWithRelations> {
		const row = await this.fetchProjectRowById(projectId);
		if (!row) {
			throw new Error("Project not found");
		}
		if (userId === row.project.leadId) {
			throw new Error("Cannot remove project lead");
		}
		await db
			.delete(projectMemberTable)
			.where(
				and(
					eq(projectMemberTable.projectId, projectId),
					eq(projectMemberTable.userId, userId),
				),
			);
		const updated = await this.fetchProjectRowById(projectId);
		if (!updated) {
			throw new Error("Project not found after member removal");
		}
		const members = await this.fetchProjectMembers(projectId);
		return this.formatProjectResponse(updated, members);
	}

	async deleteProject(projectId: string): Promise<void> {
		const deleted = await db
			.delete(projectTable)
			.where(eq(projectTable.id, projectId))
			.returning({ id: projectTable.id });
		if (!deleted.length) {
			throw new Error("Project not found");
		}
	}
}

export const projectService: ProjectService = new ProjectService();
