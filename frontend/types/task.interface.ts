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
	dueDate?: string | null;
	startDate?: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface ITaskAssignee {
	id: string;
	taskId: string;
	userId: string;
	userEmail?: string | null;
	userFullname?: string | null;
	userProfilePicture?: string | null;
	assignedBy: string;
	assignedAt: string;
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
	createdAt: string;
	updatedAt: string;
}

export interface ICreateTaskPayload {
	title: string;
	description?: string | null;
	priority?: TaskPriority;
	status?: TaskStatus;
	position?: number;
	dueDate?: string | null;
	startDate?: string | null;
}

export interface IUpdateTaskPayload {
	title?: string;
	description?: string | null;
	priority?: TaskPriority;
	status?: TaskStatus;
	position?: number;
	dueDate?: string | null;
	startDate?: string | null;
}

export interface ICreateTaskCommentPayload {
	content: string;
	parentId?: string | null;
}

export interface IUpdateTaskCommentPayload {
	content: string;
}

export interface ITaskCommentAuthorPayload {
	id: string;
	fullname: string;
	profilePicture?: string | null;
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

export interface ITasksResponse {
	tasks: ITaskWithDetails[];
}

export interface ITaskDetailResponse {
	task: ITaskWithDetails;
}

export interface ITaskCommentsResponse {
	comments: ITaskComment[];
}

export interface ICreateTaskResponse {
	message: string;
	task: ITask;
}

export interface IUpdateTaskResponse {
	message: string;
	task: ITask;
}

export interface IAssignTaskResponse {
	message: string;
	assignee: ITaskAssignee;
}

export interface ICreateCommentResponse {
	message: string;
	comment: ITaskComment;
}

export interface IUpdateCommentResponse {
	message: string;
	comment: ITaskComment;
}

export interface IGenericTaskMessage {
	message: string;
}
