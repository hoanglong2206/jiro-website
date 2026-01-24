// Allow broader string values from DB while keeping suggested literals
export type TaskPriority =
	| "low"
	| "medium"
	| "high"
	| "urgent"
	| (string & {})
	| null;
export type TaskStatus =
	| "todo"
	| "in-progress"
	| "done"
	| "blocked"
	| (string & {})
	| null;

export interface ITask {
	id: string;
	boardId: string;
	projectId: string;
	title: string;
	description?: string | null;
	position: number | null;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate?: Date | null;
	startDate?: Date | null;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ITaskAssignee {
	id: string;
	taskId: string;
	userId: string;
	userEmail?: string | null;
	userFullname?: string | null;
	userProfilePicture?: string | null;
	assignedBy: string;
	assignedAt: Date;
}

export interface ITaskComment {
	id: string;
	taskId: string;
	userId: string;
	userFullname?: string | null;
	userProfilePicture?: string | null;
	content: string;
	parentId?: string | null;
	isEdited: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateTaskPayload {
	title: string;
	description?: string | null;
	priority?: TaskPriority;
	status?: TaskStatus;
	position?: number;
	dueDate?: Date | null;
	startDate?: Date | null;
}

export interface IUpdateTaskPayload {
	title?: string;
	description?: string | null;
	priority?: TaskPriority;
	status?: TaskStatus;
	position?: number;
	dueDate?: Date | null;
	startDate?: Date | null;
}

export interface ICreateTaskCommentPayload {
	content: string;
	parentId?: string | null;
}

export interface IUpdateTaskCommentPayload {
	content: string;
}

export interface IAssignTaskPayload {
	userId: string;
	userEmail?: string | null;
	userFullname?: string | null;
	userProfilePicture?: string | null;
}

export interface ITaskWithDetails extends ITask {
	assignees: ITaskAssignee[];
	commentsCount: number;
}
