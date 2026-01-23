import { api } from "@/store/api";
import {
	IBoardResponse,
	ICreateBoardPayload,
	ICreateProjectPayload,
	ICreateWorkspacePayload,
	IProjectDetailResponse,
	IProjectResponse,
	IProjectsResponse,
	IUpdateBoardPayload,
	IUpdateProjectPayload,
	IUpdateWorkspacePayload,
	IWorkspaceResponse,
} from "@/types/project.interface";

export const projectApi = api.injectEndpoints({
	endpoints: (build) => ({
		getProjects: build.query<IProjectsResponse, void>({
			query: () => "project/getAll",
			providesTags: ["Project"],
		}),
		getProjectById: build.query<IProjectDetailResponse, string>({
			query: (projectId) => `project/${projectId}`,
			providesTags: ["Project"],
		}),
		createProject: build.mutation<
			{ message: string; project: IProjectResponse },
			ICreateProjectPayload
		>({
			query: (body) => ({
				url: "project/create",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Project"],
		}),
		updateProject: build.mutation<
			{ message: string; project: IProjectResponse },
			{
				project: IUpdateProjectPayload;
				userId: string;
				projectId: string;
			}
		>({
			query: ({ projectId, ...body }) => ({
				url: `project/${projectId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Project"],
		}),
		deleteProject: build.mutation<
			{ message: string; project: IProjectResponse },
			string
		>({
			query: (projectId) => ({
				url: `project/${projectId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Project"],
		}),
		createWorkspace: build.mutation<
			{ message: string; workspace: IWorkspaceResponse },
			{ projectId: string; workspace: ICreateWorkspacePayload }
		>({
			query: ({ projectId, workspace }) => ({
				url: `project/${projectId}/workspaces`,
				method: "POST",
				body: { workspace },
			}),
			invalidatesTags: ["Project"],
		}),
		updateWorkspace: build.mutation<
			{ message: string; workspace: IWorkspaceResponse },
			{
				projectId: string;
				workspaceId: string;
				workspace: IUpdateWorkspacePayload;
			}
		>({
			query: ({ projectId, workspaceId, workspace }) => ({
				url: `project/${projectId}/workspaces/${workspaceId}`,
				method: "PATCH",
				body: { workspace },
			}),
			invalidatesTags: ["Project"],
		}),
		deleteWorkspace: build.mutation<
			{ message: string; workspace: IWorkspaceResponse },
			{ projectId: string; workspaceId: string }
		>({
			query: ({ projectId, workspaceId }) => ({
				url: `project/${projectId}/workspaces/${workspaceId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Project"],
		}),
		createBoard: build.mutation<
			{ message: string; board: IBoardResponse },
			{
				projectId: string;
				workspaceId: string;
				board: ICreateBoardPayload;
			}
		>({
			query: ({ projectId, workspaceId, board }) => ({
				url: `project/${projectId}/workspaces/${workspaceId}/boards`,
				method: "POST",
				body: { board },
			}),
			invalidatesTags: ["Project"],
		}),
		updateBoard: build.mutation<
			{ message: string; board: IBoardResponse },
			{
				projectId: string;
				workspaceId: string;
				boardId: string;
				board: IUpdateBoardPayload;
			}
		>({
			query: ({ projectId, workspaceId, boardId, board }) => ({
				url: `project/${projectId}/workspaces/${workspaceId}/boards/${boardId}`,
				method: "PATCH",
				body: { board },
			}),
			invalidatesTags: ["Project"],
		}),
		deleteBoard: build.mutation<
			{ message: string; board: IBoardResponse },
			{ projectId: string; workspaceId: string; boardId: string }
		>({
			query: ({ projectId, workspaceId, boardId }) => ({
				url: `project/${projectId}/workspaces/${workspaceId}/boards/${boardId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Project"],
		}),
	}),
});

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
	useCreateWorkspaceMutation,
	useUpdateWorkspaceMutation,
	useDeleteWorkspaceMutation,
	useCreateBoardMutation,
	useUpdateBoardMutation,
	useDeleteBoardMutation,
} = projectApi;
