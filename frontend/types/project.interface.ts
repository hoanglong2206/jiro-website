import { IUser } from "./user.interface";

export interface ProjectRequest {
	id: string;
	name: string;
	description: string;
	type: "work" | "personal";
	leadId: string;
	memberIds: string[] | null;
	icon: string;
}

export interface ProjectResponse {
	id: string;
	name: string;
	description: string;
	type: "work" | "personal";
	lead: IUser;
	members: IUser[] | null;
	icon: string;
	createAt: Date;
	updateAt: Date;
}
