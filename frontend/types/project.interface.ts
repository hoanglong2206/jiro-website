import { IUser } from "./user.interface";

export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectType = "work" | "personal";
export type ProjectAccessLevel = "private" | "public";

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
