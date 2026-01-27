import { api } from "@/store/api";
import {
	IAssignTaskPayload,
	IAssignTaskResponse,
	ICreateCommentResponse,
	ICreateTaskPayload,
	ICreateTaskResponse,
	ICreateTaskCommentPayload,
	IGenericTaskMessage,
	ITaskCommentAuthorPayload,
	ITaskCommentsResponse,
	ITaskDetailResponse,
	ITasksResponse,
	IUpdateCommentResponse,
	IUpdateTaskPayload,
	IUpdateTaskResponse,
	IUpdateTaskCommentPayload,
} from "@/types/task.interface";

export const taskApi = api.injectEndpoints({
	endpoints: (build) => ({
		getTasksByBoard: build.query<
			ITasksResponse,
			{ projectId: string; boardId: string }
		>({
			query: ({ projectId, boardId }) =>
				`project/${projectId}/boards/${boardId}/tasks`,
			providesTags: ["Task"],
		}),
		getTaskById: build.query<ITaskDetailResponse, string>({
			query: (taskId) => `project/tasks/${taskId}`,
			providesTags: ["Task"],
		}),
		createTask: build.mutation<
			ICreateTaskResponse,
			{ projectId: string; boardId: string; task: ICreateTaskPayload }
		>({
			query: ({ projectId, boardId, task }) => ({
				url: `project/${projectId}/boards/${boardId}/tasks`,
				method: "POST",
				body: { task },
			}),
			invalidatesTags: ["Task"],
		}),
		updateTask: build.mutation<
			IUpdateTaskResponse,
			{ taskId: string; task: IUpdateTaskPayload }
		>({
			query: ({ taskId, task }) => ({
				url: `project/tasks/${taskId}`,
				method: "PATCH",
				body: { task },
			}),
			invalidatesTags: ["Task"],
		}),
		deleteTask: build.mutation<IGenericTaskMessage, string>({
			query: (taskId) => ({
				url: `project/tasks/${taskId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Task"],
		}),
		assignTask: build.mutation<
			IAssignTaskResponse,
			{ taskId: string; assignee: IAssignTaskPayload }
		>({
			query: ({ taskId, assignee }) => ({
				url: `project/tasks/${taskId}/assign`,
				method: "POST",
				body: { assignee },
			}),
			invalidatesTags: ["Task"],
		}),
		unassignTask: build.mutation<
			IGenericTaskMessage,
			{ taskId: string; userId: string }
		>({
			query: ({ taskId, userId }) => ({
				url: `project/tasks/${taskId}/assign/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Task"],
		}),
		createComment: build.mutation<
			ICreateCommentResponse,
			{
				taskId: string;
				comment: ICreateTaskCommentPayload;
				user: ITaskCommentAuthorPayload;
			}
		>({
			query: ({ taskId, comment, user }) => ({
				url: `project/tasks/${taskId}/comments`,
				method: "POST",
				body: { comment, user },
			}),
			invalidatesTags: ["Task", "TaskComment"],
		}),
		getCommentsByTask: build.query<ITaskCommentsResponse, string>({
			query: (taskId) => `project/tasks/${taskId}/comments`,
			providesTags: ["TaskComment"],
		}),
		updateComment: build.mutation<
			IUpdateCommentResponse,
			{ commentId: string; comment: IUpdateTaskCommentPayload }
		>({
			query: ({ commentId, comment }) => ({
				url: `project/comments/${commentId}`,
				method: "PATCH",
				body: { comment },
			}),
			invalidatesTags: ["Task", "TaskComment"],
		}),
		deleteComment: build.mutation<IGenericTaskMessage, string>({
			query: (commentId) => ({
				url: `project/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Task", "TaskComment"],
		}),
	}),
});

export const {
	useGetTasksByBoardQuery,
	useGetTaskByIdQuery,
	useCreateTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useAssignTaskMutation,
	useUnassignTaskMutation,
	useCreateCommentMutation,
	useGetCommentsByTaskQuery,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
} = taskApi;
