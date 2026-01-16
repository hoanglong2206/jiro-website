import { IUser } from "./user.interface";

export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectType = "work" | "personal";
export type ProjectAcessLevel = "private" | "public";

export interface IProjectResponse {
	id: string;
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAcessLevel;
	ownerId: string;
	icon: string;
}

export interface ICreateProjectPayload {
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAcessLevel;
	icon?: string;
}

export interface IUpdateProjectPayload {
	id: string;
	name?: string;
	description?: string;
	type?: ProjectType;
	accessLevel?: ProjectAcessLevel;
	icon?: string;
}
