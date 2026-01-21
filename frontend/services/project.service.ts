import { api } from "@/store/api";
import {
	ICreateProjectPayload,
	IUpdateProjectPayload,
	IProjectDetailResponse,
	IProjectsResponse,
	IProjectResponse,
} from "@/types/project.interface";

export const projectApi = api.injectEndpoints({
	endpoints: (build) => ({
		getProjects: build.query<IProjectsResponse, void>({
			query: () => "project/getAll",
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
		getProjectById: build.query<IProjectDetailResponse, string>({
			query: (projectId) => `project/${projectId}`,
			providesTags: ["Project"],
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
	}),
});

export const {
	useGetProjectsQuery,
	useCreateProjectMutation,
	useGetProjectByIdQuery,
	useUpdateProjectMutation,
} = projectApi;
