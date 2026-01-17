import { api } from "@/store/api";
import {
	ICreateProjectPayload,
	ICreateProjectResponse,
	IProjectDetailResponse,
	IProjectsResponse,
} from "@/types/project.interface";

export const projectApi = api.injectEndpoints({
	endpoints: (build) => ({
		getProjects: build.query<IProjectsResponse, void>({
			query: () => "project/getAll",
			providesTags: ["Project"],
		}),
		createProject: build.mutation<
			ICreateProjectResponse,
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
	}),
});

export const {
	useGetProjectsQuery,
	useCreateProjectMutation,
	useGetProjectByIdQuery,
} = projectApi;
