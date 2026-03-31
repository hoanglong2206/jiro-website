import { and, eq, ExtractTablesWithRelations, desc, inArray } from "drizzle-orm";
import { db } from "../database";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { tasks, taskAssignees, taskComments } from "../models/task.model";
import { projectMembersTable, boards } from "../models/project.model";
import {
	ICreateTaskPayload,
	IUpdateTaskPayload,
	ICreateTaskCommentPayload,
	IUpdateTaskCommentPayload,
	IAssignTaskPayload,
	ITask,
	ITaskComment,
	ITaskAssignee,
	ITaskWithDetails,
} from "../types/task.interface";
import { ProjectMemberRole } from "../types/project.interface";

type TransactionClient = PgTransaction<
	PostgresJsQueryResultHKT,
	Record<string, never>,
	ExtractTablesWithRelations<Record<string, never>>
>;

type QueryClient = typeof db | TransactionClient;

type TaskRecord = typeof tasks.$inferSelect;
type NewTaskRecord = typeof tasks.$inferInsert;
type TaskAssigneeRecord = typeof taskAssignees.$inferSelect;
type NewTaskAssigneeRecord = typeof taskAssignees.$inferInsert;
type TaskCommentRecord = typeof taskComments.$inferSelect;
type NewTaskCommentRecord = typeof taskComments.$inferInsert;

class TaskService {
	private async ensureBoardAccess(
		queryClient: QueryClient,
		boardId: string,
		projectId: string,
		userId: string,
		options?: {
			allowedRoles?: ProjectMemberRole[];
			action?: string;
			deniedMessage?: string;
		},
	): Promise<void> {
		const boardRows = await queryClient
			.select()
			.from(boards)
			.where(and(eq(boards.id, boardId), eq(boards.projectId, projectId)))
			.limit(1);

		if (!boardRows[0]) {
			throw new Error("Board not found or doesn't belong to this project");
		}

		const membershipRows = await queryClient
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

		if (
			options?.allowedRoles &&
			!options.allowedRoles.includes(membership.role as ProjectMemberRole)
		) {
			const deniedMessage =
				options.deniedMessage ??
				(options.action
					? `You do not have permission to ${options.action}`
					: "You do not have permission to perform this action");
			throw new Error(deniedMessage);
		}
	}

	private async ensureTaskAccess(
		queryClient: QueryClient,
		taskId: string,
		userId: string,
		options?: {
			allowedRoles?: ProjectMemberRole[];
			action?: string;
		},
	): Promise<TaskRecord> {
		const taskRows = await queryClient
			.select()
			.from(tasks)
			.where(eq(tasks.id, taskId))
			.limit(1);

		const task = taskRows[0];
		if (!task) {
			throw new Error("Task not found");
		}

		const membershipRows = await queryClient
			.select()
			.from(projectMembersTable)
			.where(
				and(
					eq(projectMembersTable.projectId, task.projectId),
					eq(projectMembersTable.userId, userId),
				),
			)
			.limit(1);

		const membership = membershipRows[0];
		if (!membership) {
			throw new Error("You are not a member of this project");
		}

		if (
			options?.allowedRoles &&
			!options.allowedRoles.includes(membership.role as ProjectMemberRole)
		) {
			const deniedMessage = options.action
				? `You do not have permission to ${options.action}`
				: "You do not have permission to perform this action";
			throw new Error(deniedMessage);
		}

		return task;
	}

	async createTask(
		boardId: string,
		projectId: string,
		userId: string,
		payload: ICreateTaskPayload,
	): Promise<TaskRecord> {
		return db.transaction(async (trx) => {
			await this.ensureBoardAccess(trx, boardId, projectId, userId, {
				allowedRoles: ["owner", "admin", "member"],
				action: "create tasks in this board",
			});

			const taskToInsert: NewTaskRecord = {
				boardId,
				projectId,
				title: payload.title.trim(),
				description: payload.description?.trim() || null,
				priority: payload.priority || "medium",
				status: payload.status || "todo",
				position: payload.position ?? 0,
				dueDate: payload.dueDate || null,
				startDate: payload.startDate || null,
				createdBy: userId,
			};

			const insertedTasks = await trx
				.insert(tasks)
				.values(taskToInsert)
				.returning();

			const task = insertedTasks[0];
			if (!task) {
				throw new Error("Failed to create task");
			}

			return task;
		});
	}

	async getTasksByBoard(
		boardId: string,
		projectId: string,
		userId: string,
	): Promise<ITaskWithDetails[]> {
		await this.ensureBoardAccess(db, boardId, projectId, userId);

		const taskRows = await db
			.select()
			.from(tasks)
			.where(and(eq(tasks.boardId, boardId), eq(tasks.projectId, projectId)))
			.orderBy(tasks.position);

		const taskIds = taskRows.map((t) => t.id);
		if (taskIds.length === 0) {
			return [];
		}

		const [assigneesData, commentsData] = await Promise.all([
			db.select().from(taskAssignees).where(inArray(taskAssignees.taskId, taskIds)),
			db.select().from(taskComments).where(inArray(taskComments.taskId, taskIds)),
		]);

		const assigneesByTask = assigneesData.reduce(
			(acc, assignee) => {
				if (!acc[assignee.taskId]) acc[assignee.taskId] = [];
				acc[assignee.taskId].push(assignee);
				return acc;
			},
			{} as Record<string, TaskAssigneeRecord[]>,
		);

		const commentCountByTask = commentsData.reduce(
			(acc, comment) => {
				acc[comment.taskId] = (acc[comment.taskId] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return taskRows.map((task) => ({
			...task,
			assignees: assigneesByTask[task.id] || [],
			commentsCount: commentCountByTask[task.id] || 0,
		}));
	}

	async getTaskById(
		taskId: string,
		userId: string,
	): Promise<ITaskWithDetails | null> {
		const task = await this.ensureTaskAccess(db, taskId, userId);

		const assigneesData = await db
			.select()
			.from(taskAssignees)
			.where(eq(taskAssignees.taskId, taskId));

		const commentsData = await db
			.select()
			.from(taskComments)
			.where(eq(taskComments.taskId, taskId));

		return {
			...task,
			assignees: assigneesData,
			commentsCount: commentsData.length,
		};
	}

	async updateTask(
		taskId: string,
		userId: string,
		payload: IUpdateTaskPayload,
	): Promise<TaskRecord> {
		return db.transaction(async (trx) => {
			await this.ensureTaskAccess(trx, taskId, userId, {
				allowedRoles: ["owner", "admin", "member"],
				action: "update this task",
			});

			const updates: Partial<NewTaskRecord> = {};

			if (payload.title !== undefined) {
				updates.title = payload.title.trim();
			}

			if (payload.description !== undefined) {
				updates.description = payload.description?.trim() || null;
			}

			if (payload.priority !== undefined) {
				updates.priority = payload.priority;
			}

			if (payload.status !== undefined) {
				updates.status = payload.status;
			}

			if (payload.position !== undefined) {
				updates.position = payload.position;
			}

			if (payload.dueDate !== undefined) {
				updates.dueDate = payload.dueDate;
			}

			if (payload.startDate !== undefined) {
				updates.startDate = payload.startDate;
			}

			if (!Object.keys(updates).length) {
				throw new Error("No fields to update");
			}

			const updatedTasks = await trx
				.update(tasks)
				.set({
					...updates,
					updatedAt: new Date(),
				})
				.where(eq(tasks.id, taskId))
				.returning();

			const updatedTask = updatedTasks[0];
			if (!updatedTask) {
				throw new Error("Failed to update task");
			}

			return updatedTask;
		});
	}

	async deleteTask(taskId: string, userId: string): Promise<void> {
		return db.transaction(async (trx) => {
			await this.ensureTaskAccess(trx, taskId, userId, {
				allowedRoles: ["owner", "admin", "member"],
				action: "delete this task",
			});

			const deletedTasks = await trx
				.delete(tasks)
				.where(eq(tasks.id, taskId))
				.returning();

			if (!deletedTasks[0]) {
				throw new Error("Failed to delete task");
			}
		});
	}

	async assignTask(
		taskId: string,
		userId: string,
		payload: IAssignTaskPayload,
	): Promise<TaskAssigneeRecord> {
		return db.transaction(async (trx) => {
			const task = await this.ensureTaskAccess(trx, taskId, userId, {
				allowedRoles: ["owner", "admin", "member"],
				action: "assign users to this task",
			});

			const existingAssignees = await trx
				.select()
				.from(taskAssignees)
				.where(
					and(
						eq(taskAssignees.taskId, taskId),
						eq(taskAssignees.userId, payload.userId),
					),
				)
				.limit(1);

			if (existingAssignees[0]) {
				throw new Error("User is already assigned to this task");
			}

			const assigneeToInsert: NewTaskAssigneeRecord = {
				taskId,
				userId: payload.userId,
				userEmail: payload.userEmail || null,
				userFullname: payload.userFullname || null,
				userProfilePicture: payload.userProfilePicture || null,
				assignedBy: userId,
			};

			const insertedAssignees = await trx
				.insert(taskAssignees)
				.values(assigneeToInsert)
				.returning();

			const assignee = insertedAssignees[0];
			if (!assignee) {
				throw new Error("Failed to assign user to task");
			}

			return assignee;
		});
	}

	async unassignTask(
		taskId: string,
		assigneeUserId: string,
		requestUserId: string,
	): Promise<void> {
		return db.transaction(async (trx) => {
			await this.ensureTaskAccess(trx, taskId, requestUserId, {
				allowedRoles: ["owner", "admin", "member"],
				action: "unassign users from this task",
			});

			const deletedAssignees = await trx
				.delete(taskAssignees)
				.where(
					and(
						eq(taskAssignees.taskId, taskId),
						eq(taskAssignees.userId, assigneeUserId),
					),
				)
				.returning();

			if (!deletedAssignees[0]) {
				throw new Error("Failed to unassign user or user not assigned");
			}
		});
	}

	async createComment(
		taskId: string,
		userId: string,
		userFullname: string | null,
		userProfilePicture: string | null,
		payload: ICreateTaskCommentPayload,
	): Promise<TaskCommentRecord> {
		return db.transaction(async (trx) => {
			await this.ensureTaskAccess(trx, taskId, userId);

			const commentToInsert: NewTaskCommentRecord = {
				taskId,
				userId,
				userFullname,
				userProfilePicture,
				content: payload.content.trim(),
				parentId: payload.parentId || null,
			};

			const insertedComments = await trx
				.insert(taskComments)
				.values(commentToInsert)
				.returning();

			const comment = insertedComments[0];
			if (!comment) {
				throw new Error("Failed to create comment");
			}

			return comment;
		});
	}

	async getCommentsByTask(
		taskId: string,
		userId: string,
	): Promise<TaskCommentRecord[]> {
		await this.ensureTaskAccess(db, taskId, userId);

		return await db
			.select()
			.from(taskComments)
			.where(eq(taskComments.taskId, taskId))
			.orderBy(desc(taskComments.createdAt));
	}

	async updateComment(
		commentId: string,
		userId: string,
		payload: IUpdateTaskCommentPayload,
	): Promise<TaskCommentRecord> {
		return db.transaction(async (trx) => {
			const commentRows = await trx
				.select()
				.from(taskComments)
				.where(eq(taskComments.id, commentId))
				.limit(1);

			const comment = commentRows[0];
			if (!comment) {
				throw new Error("Comment not found");
			}

			if (comment.userId !== userId) {
				throw new Error("You can only edit your own comments");
			}

			const updatedComments = await trx
				.update(taskComments)
				.set({
					content: payload.content.trim(),
					isEdited: true,
					updatedAt: new Date(),
				})
				.where(eq(taskComments.id, commentId))
				.returning();

			const updatedComment = updatedComments[0];
			if (!updatedComment) {
				throw new Error("Failed to update comment");
			}

			return updatedComment;
		});
	}

	async deleteComment(commentId: string, userId: string): Promise<void> {
		return db.transaction(async (trx) => {
			const commentRows = await trx
				.select()
				.from(taskComments)
				.where(eq(taskComments.id, commentId))
				.limit(1);

			const comment = commentRows[0];
			if (!comment) {
				throw new Error("Comment not found");
			}

			if (comment.userId !== userId) {
				const task = await this.ensureTaskAccess(trx, comment.taskId, userId, {
					allowedRoles: ["owner", "admin"],
					action: "delete other users' comments",
				});
			}

			const deletedComments = await trx
				.delete(taskComments)
				.where(eq(taskComments.id, commentId))
				.returning();

			if (!deletedComments[0]) {
				throw new Error("Failed to delete comment");
			}
		});
	}
}

export const taskService: TaskService = new TaskService();
