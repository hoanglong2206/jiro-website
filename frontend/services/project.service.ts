import { api } from "@/store/api";
import { ProjectPayload, ProjectResponse } from "@/types/project.interface";

type UpdateProjectArgs = {
	projectId: string;
	body: Partial<ProjectPayload> & { memberIds?: string[] };
};

type RemoveMemberArgs = {
	projectId: string;
	userId: string;
};

export const projectApi = api.injectEndpoints({
	endpoints: (build) => ({
		getProjects: build.query<ProjectResponse[], void>({
			query: () => "project",
			transformResponse: (response: { projects: ProjectResponse[] }) =>
				response.projects,
			providesTags: (result) =>
				result
					? [
							...result.map((project) => ({
								type: "Project" as const,
								id: project.id,
							})),
							{ type: "Project" as const, id: "LIST" },
					  ]
					: [{ type: "Project" as const, id: "LIST" }],
		}),
		getProjectById: build.query<ProjectResponse, string>({
			query: (projectId) => `project/${projectId}`,
			transformResponse: (response: { project: ProjectResponse }) =>
				response.project,
			providesTags: (_result, _error, id) => [{ type: "Project" as const, id }],
		}),
		createProject: build.mutation<ProjectResponse, ProjectPayload>({
			query: (body) => ({
				url: "project",
				method: "POST",
				body,
			}),
			transformResponse: (response: { project: ProjectResponse }) =>
				response.project,
			invalidatesTags: [{ type: "Project" as const, id: "LIST" }],
		}),
		updateProject: build.mutation<ProjectResponse, UpdateProjectArgs>({
			query: ({ projectId, body }) => ({
				url: `project/${projectId}`,
				method: "PUT",
				body,
			}),
			transformResponse: (response: { project: ProjectResponse }) =>
				response.project,
			invalidatesTags: (_result, _error, { projectId }) => [
				{ type: "Project" as const, id: projectId },
				{ type: "Project" as const, id: "LIST" },
			],
		}),
		removeProjectMember: build.mutation<ProjectResponse, RemoveMemberArgs>({
			query: ({ projectId, userId }) => ({
				url: `project/${projectId}/members/${userId}`,
				method: "DELETE",
			}),
			transformResponse: (response: { project: ProjectResponse }) =>
				response.project,
			invalidatesTags: (_result, _error, { projectId }) => [
				{ type: "Project" as const, id: projectId },
				{ type: "Project" as const, id: "LIST" },
			],
		}),
		deleteProject: build.mutation<void, string>({
			query: (projectId) => ({
				url: `project/${projectId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, projectId) => [
				{ type: "Project" as const, id: projectId },
				{ type: "Project" as const, id: "LIST" },
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useRemoveProjectMemberMutation,
	useDeleteProjectMutation,
} = projectApi;
