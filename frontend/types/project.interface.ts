import { IUser } from "./user.interface";

export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectType = "work" | "personal";
export type ProjectAccessLevel = "private" | "public";

export const WORKFLOW_CONFIG = {
	starter: [
		{ label: "TO DO", color: "#9ca3af" },
		{ label: "IN PROGRESS", color: "#6366f1" },
		{ label: "DONE", color: "#10b981" },
	],
	"marketing-teams": [
		{ label: "BACKLOG", color: "#9ca3af" },
		{ label: "PLANNING", color: "#6366f1" },
		{ label: "IN PROGRESS", color: "#6366f1" },
		{ label: "DONE", color: "#10b981" },
	],
	"project-management": [
		{ label: "TO DO", color: "#9ca3af" },
		{ label: "PLANNING", color: "#9ca3af" },
		{ label: "IN PROGRESS", color: "#6366f1" },
		{ label: "DONE", color: "#10b981" },
		{ label: "CANCELLED", color: "#f472b6" },
	],
	"product-engineering": [
		{ label: "BACKLOG", color: "#9ca3af" },
		{ label: "SCOPING", color: "#6366f1" },
		{ label: "IN REVIEW", color: "#f472b6" },
		{ label: "TESTING", color: "#a8a29e" },
		{ label: "SHIPPED", color: "#10b981" },
	],
} as const;

export interface IProjectResponse {
	id: string;
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	ownerId: string;
	ownerEmail: string;
	ownerFullname: string;
	ownerProfilePicture?: string;
	ownerColorAvatar?: string;
	color?: string | null;
	icon?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateProjectPayload {
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	color: string;
	icon?: string;
	user: IUser;
}

export interface IUpdateProjectPayload {
	name?: string;
	description?: string;
	type?: ProjectType;
	accessLevel?: ProjectAccessLevel;
	color?: string;
	icon?: string;
}

export interface IProjectMemberResponse {
	id: string;
	projectId: string;
	userId: string;
	userEmail: string;
	userFullname: string;
	userColorAvatar?: string;
	userProfilePicture?: string;
	role: ProjectMemberRole;
	invitedBy: string;
	joinedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface IProjectsResponse {
	projects: IProjectResponse[];
}

export interface IProjectDetailResponse {
	project: IProjectResponse;
}
