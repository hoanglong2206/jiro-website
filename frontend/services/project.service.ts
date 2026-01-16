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
			query: () => "project",
			providesTags: (result) =>
				result?.projects
					? [
							...result.projects.map(({ project }) => ({
								type: "Project" as const,
								id: project.id,
							})),
							{ type: "Project" as const, id: "LIST" },
					  ]
					: [{ type: "Project" as const, id: "LIST" }],
		}),
		createProject: build.mutation<
			ICreateProjectResponse,
			ICreateProjectPayload
		>({
			query: (body) => ({
				url: "project",
				method: "POST",
				body,
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: "Project" as const, id: "LIST" },
							{ type: "Project" as const, id: result.project.id },
					  ]
					: [{ type: "Project" as const, id: "LIST" }],
		}),
		getProjectById: build.query<IProjectDetailResponse, string>({
			query: (projectId) => `project/${projectId}`,
			providesTags: (result, _error, arg) => [
				{ type: "Project" as const, id: arg },
			],
		}),
	}),
});

export const {
	useGetProjectsQuery,
	useLazyGetProjectsQuery,
	useCreateProjectMutation,
	useGetProjectByIdQuery,
} = projectApi;
