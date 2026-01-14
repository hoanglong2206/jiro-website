import { IUser } from "./user.interface";

export type ProjectType = "work" | "personal";

export interface ProjectPayload {
	name: string;
	description?: string;
	type: ProjectType;
	icon?: string;
	memberIds?: string[];
}

export interface ProjectResponse {
	id: string;
	name: string;
	description?: string | null;
	type: ProjectType;
	leadId: string;
	lead: IUser;
	members: IUser[];
	icon?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ProjectInvite {}
export interface ProjectMembers {}
