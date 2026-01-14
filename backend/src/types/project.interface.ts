import { IUser } from "./user.interface";

export type ProjectType = "work" | "personal";

export interface IProject {
	id: string;
	name: string;
	description?: string | null;
	type: ProjectType;
	leadId: string;
	icon?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface IProjectWithRelations extends IProject {
	lead?: IUser | null;
	members?: IUser[];
}

export interface ICreateProjectPayload {
	name: string;
	description?: string;
	type: ProjectType;
	leadId: string;
	icon?: string;
	memberIds?: string[];
}

export interface IUpdateProjectPayload {
	name?: string;
	description?: string | null;
	type?: ProjectType;
	icon?: string | null;
	memberIds?: string[];
}

export interface IProjectMemberPayload {
	projectId: string;
	userId: string;
}
