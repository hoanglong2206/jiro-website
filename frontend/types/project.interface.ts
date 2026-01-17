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
	color?: string | null;
	icon?: string | null;
}

export interface ICreateProjectPayload {
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	color: string;
	user: IUser;
}

export interface IUpdateProjectPayload {
	id: string;
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
	userEmail?: string | null;
	userFullname?: string | null;
	userColorAvatar?: string | null;
	userProfilePicture?: string | null;
	role: ProjectMemberRole;
	invitedBy?: string | null;
	joinedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface IProjectWithMembershipResponse {
	project: IProjectResponse;
	membership: IProjectMemberResponse;
}

export interface IProjectsResponse {
	projects: IProjectWithMembershipResponse[];
}

export type IProjectDetailResponse = IProjectWithMembershipResponse;

export interface ICreateProjectResponse {
	message: string;
	project: IProjectResponse;
	membership: IProjectMemberResponse;
}
