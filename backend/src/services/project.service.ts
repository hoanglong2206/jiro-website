import { and, eq } from "drizzle-orm";
import { db } from "../database";
import {
	NewProjectMemberRecord,
	NewProjectRecord,
	NewWorkspaceRecord,
	NewBoardRecord,
	ProjectRecord,
	WorkspaceRecord,
	BoardRecord,
	projectMembersTable,
	projectTable,
	workspaces,
	boards,
} from "../models/project.model";
import {
	ICreateProjectPayload,
	IUpdateProjectPayload,
	ICreateWorkspacePayload,
	IUpdateWorkspacePayload,
	ICreateBoardPayload,
	IUpdateBoardPayload,
} from "../types/project.interface";
import { IUser } from "../types/user.interface";
import { uploads, isUploadSuccess } from "../helpers/cloudinaryUpload";

class ProjectService {
	async createProject(
		payload: ICreateProjectPayload,
		user: IUser,
	): Promise<ProjectRecord> {
		return db.transaction(async (trx) => {
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
				throw new Error("You do not have permission to update this project");
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
				if (!payload.icon) {
					updates.icon = null;
				} else if (payload.icon.startsWith("http")) {
					updates.icon = payload.icon;
				} else {
					const uploadResult = await uploads(
						payload.icon,
						`projects/${projectId}`,
						true,
						true,
					);

					if (!uploadResult) {
						throw new Error("Failed to upload icon");
					}
					if (isUploadSuccess(uploadResult)) {
						updates.icon = uploadResult.secure_url;
					} else {
						throw new Error(uploadResult.message || "Failed to upload icon");
					}
				}
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

	async createWorkspace(
		projectId: string,
		userId: string,
		payload: ICreateWorkspacePayload,
	): Promise<WorkspaceRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		const normalizedName = payload.name?.trim() ?? "";
		if (!normalizedName.length) {
			throw new Error("Workspace name is required");
		}
		if (normalizedName.length < 2) {
			throw new Error("Workspace name must be at least 2 characters long");
		}
		if (normalizedName.length > 120) {
			throw new Error("Workspace name must be at most 120 characters long");
		}

		const normalizedKey = (payload.key ?? "").replace(/\s+/g, "").toUpperCase();
		if (!normalizedKey.length) {
			throw new Error("Workspace key is required");
		}
		if (normalizedKey.length < 2 || normalizedKey.length > 10) {
			throw new Error("Workspace key must be between 2 and 10 characters long");
		}
		if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(normalizedKey)) {
			throw new Error(
				"Workspace key must start with an alphanumeric character and contain only letters, numbers, hyphens, or underscores",
			);
		}

		const normalizedColor =
			payload.color !== undefined && payload.color !== null
				? payload.color.trim() || null
				: null;

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to create workspaces");
			}

			const existingKey = await trx
				.select({ id: workspaces.id })
				.from(workspaces)
				.where(
					and(
						eq(workspaces.projectId, projectId),
						eq(workspaces.key, normalizedKey),
					),
				)
				.limit(1);
			if (existingKey[0]) {
				throw new Error("Workspace key already exists for this project");
			}

			const workspaceToInsert: NewWorkspaceRecord = {
				projectId,
				name: normalizedName,
				key: normalizedKey,
				color: normalizedColor,
				createdBy: userId,
			};

			const inserted = await trx
				.insert(workspaces)
				.values(workspaceToInsert)
				.returning();

			const workspace = inserted[0];
			if (!workspace) {
				throw new Error("Failed to create workspace");
			}

			return workspace;
		});
	}

	async updateWorkspace(
		projectId: string,
		workspaceId: string,
		userId: string,
		payload: IUpdateWorkspacePayload,
	): Promise<WorkspaceRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!workspaceId) {
			throw new Error("Workspace ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to update workspaces");
			}

			const existingWorkspaceRows = await trx
				.select()
				.from(workspaces)
				.where(
					and(
						eq(workspaces.id, workspaceId),
						eq(workspaces.projectId, projectId),
					),
				)
				.limit(1);

			const existingWorkspace = existingWorkspaceRows[0];
			if (!existingWorkspace) {
				throw new Error("Workspace not found");
			}

			const updates: Partial<NewWorkspaceRecord> = {};

			if (payload.name !== undefined) {
				const trimmedName = payload.name.trim();
				if (!trimmedName.length) {
					throw new Error("Workspace name cannot be empty");
				}
				if (trimmedName.length < 2) {
					throw new Error("Workspace name must be at least 2 characters long");
				}
				if (trimmedName.length > 120) {
					throw new Error("Workspace name must be at most 120 characters long");
				}
				updates.name = trimmedName;
			}

			if (payload.key !== undefined) {
				const normalizedKey = payload.key.replace(/\s+/g, "").toUpperCase();
				if (!normalizedKey.length) {
					throw new Error("Workspace key cannot be empty");
				}
				if (normalizedKey.length < 2 || normalizedKey.length > 10) {
					throw new Error(
						"Workspace key must be between 2 and 10 characters long",
					);
				}
				if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(normalizedKey)) {
					throw new Error(
						"Workspace key must start with an alphanumeric character and contain only letters, numbers, hyphens, or underscores",
					);
				}

				const keyConflict = await trx
					.select({ id: workspaces.id })
					.from(workspaces)
					.where(
						and(
							eq(workspaces.projectId, projectId),
							eq(workspaces.key, normalizedKey),
						),
					)
					.limit(1);
				if (keyConflict[0] && keyConflict[0].id !== workspaceId) {
					throw new Error("Workspace key already exists for this project");
				}

				updates.key = normalizedKey;
			}

			if (payload.color !== undefined) {
				updates.color = payload.color ? payload.color.trim() : null;
			}

			if (!Object.keys(updates).length) {
				return existingWorkspace;
			}

			const updatedRows = await trx
				.update(workspaces)
				.set({
					...updates,
					updatedAt: new Date(),
				})
				.where(eq(workspaces.id, workspaceId))
				.returning();

			const updatedWorkspace = updatedRows[0];
			if (!updatedWorkspace) {
				throw new Error("Failed to update workspace");
			}

			return updatedWorkspace;
		});
	}

	async createBoard(
		projectId: string,
		workspaceId: string,
		userId: string,
		payload: ICreateBoardPayload,
	): Promise<BoardRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!workspaceId) {
			throw new Error("Workspace ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		const normalizedName = payload.name?.trim() ?? "";
		if (!normalizedName.length) {
			throw new Error("Board name is required");
		}
		if (normalizedName.length < 2) {
			throw new Error("Board name must be at least 2 characters long");
		}
		if (normalizedName.length > 120) {
			throw new Error("Board name must be at most 120 characters long");
		}

		let normalizedPosition: number | undefined;
		if (payload.position !== undefined) {
			if (!Number.isInteger(payload.position)) {
				throw new Error("Board position must be an integer");
			}
			if (payload.position < 0) {
				throw new Error("Board position must be zero or greater");
			}
			normalizedPosition = payload.position;
		}

		const normalizedColor =
			payload.color !== undefined && payload.color !== null
				? payload.color.trim() || null
				: null;

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to create boards");
			}

			const workspaceRows = await trx
				.select()
				.from(workspaces)
				.where(
					and(
						eq(workspaces.id, workspaceId),
						eq(workspaces.projectId, projectId),
					),
				)
				.limit(1);

			const workspace = workspaceRows[0];
			if (!workspace) {
				throw new Error("Workspace not found");
			}

			const boardToInsert: NewBoardRecord = {
				projectId,
				workspaceId,
				name: normalizedName,
				color: normalizedColor,
				createdBy: userId,
			};

			if (normalizedPosition !== undefined) {
				boardToInsert.position = normalizedPosition;
			}

			const insertedRows = await trx
				.insert(boards)
				.values(boardToInsert)
				.returning();

			const board = insertedRows[0];
			if (!board) {
				throw new Error("Failed to create board");
			}

			return board;
		});
	}

	async updateBoard(
		projectId: string,
		workspaceId: string,
		boardId: string,
		userId: string,
		payload: IUpdateBoardPayload,
	): Promise<BoardRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!workspaceId) {
			throw new Error("Workspace ID is required");
		}

		if (!boardId) {
			throw new Error("Board ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to update boards");
			}

			const existingBoardRows = await trx
				.select()
				.from(boards)
				.where(
					and(
						eq(boards.id, boardId),
						eq(boards.projectId, projectId),
						eq(boards.workspaceId, workspaceId),
					),
				)
				.limit(1);

			const existingBoard = existingBoardRows[0];
			if (!existingBoard) {
				throw new Error("Board not found");
			}

			const updates: Partial<NewBoardRecord> = {};

			if (payload.name !== undefined) {
				const trimmedName = payload.name.trim();
				if (!trimmedName.length) {
					throw new Error("Board name cannot be empty");
				}
				if (trimmedName.length < 2) {
					throw new Error("Board name must be at least 2 characters long");
				}
				if (trimmedName.length > 120) {
					throw new Error("Board name must be at most 120 characters long");
				}
				updates.name = trimmedName;
			}

			if (payload.color !== undefined) {
				updates.color = payload.color ? payload.color.trim() : null;
			}

			if (payload.position !== undefined) {
				if (!Number.isInteger(payload.position)) {
					throw new Error("Board position must be an integer");
				}
				if (payload.position < 0) {
					throw new Error("Board position must be zero or greater");
				}
				updates.position = payload.position;
			}

			if (!Object.keys(updates).length) {
				return existingBoard;
			}

			const updatedRows = await trx
				.update(boards)
				.set({
					...updates,
					updatedAt: new Date(),
				})
				.where(eq(boards.id, boardId))
				.returning();

			const updatedBoard = updatedRows[0];
			if (!updatedBoard) {
				throw new Error("Failed to update board");
			}

			return updatedBoard;
		});
	}

	async deleteProject(
		projectId: string,
		userId: string,
	): Promise<ProjectRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner") {
				throw new Error("Only the project owner can delete the project");
			}

			const deletedRows = await trx
				.delete(projectTable)
				.where(eq(projectTable.id, projectId))
				.returning();

			const deletedProject = deletedRows[0];
			if (!deletedProject) {
				throw new Error("Project not found");
			}

			return deletedProject;
		});
	}

	async deleteWorkspace(
		projectId: string,
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!workspaceId) {
			throw new Error("Workspace ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to delete workspaces");
			}

			const deletedRows = await trx
				.delete(workspaces)
				.where(
					and(
						eq(workspaces.id, workspaceId),
						eq(workspaces.projectId, projectId),
					),
				)
				.returning();

			const deletedWorkspace = deletedRows[0];
			if (!deletedWorkspace) {
				throw new Error("Workspace not found");
			}

			return deletedWorkspace;
		});
	}

	async deleteBoard(
		projectId: string,
		workspaceId: string,
		boardId: string,
		userId: string,
	): Promise<BoardRecord> {
		if (!projectId) {
			throw new Error("Project ID is required");
		}

		if (!workspaceId) {
			throw new Error("Workspace ID is required");
		}

		if (!boardId) {
			throw new Error("Board ID is required");
		}

		if (!userId) {
			throw new Error("User ID is required");
		}

		return db.transaction(async (trx) => {
			const membershipRows = await trx
				.select()
				.from(projectMembersTable)
				.where(
					and(
						eq(projectMembersTable.projectId, projectId),
						eq(projectMembersTable.userId, userId),
					),
				)
				.limit(1);

			const membership = membershipRows[0];
			if (!membership) {
				throw new Error("You are not a member of this project");
			}

			if (membership.role !== "owner" && membership.role !== "admin") {
				throw new Error("You do not have permission to delete boards");
			}

			const deletedRows = await trx
				.delete(boards)
				.where(
					and(
						eq(boards.id, boardId),
						eq(boards.projectId, projectId),
						eq(boards.workspaceId, workspaceId),
					),
				)
				.returning();

			const deletedBoard = deletedRows[0];
			if (!deletedBoard) {
				throw new Error("Board not found");
			}

			return deletedBoard;
		});
	}
}

export const projectService: ProjectService = new ProjectService();
