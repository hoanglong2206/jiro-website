import { IUser } from "./user.interface";

export interface ProjectRequest {
	id: string;
	name: string;
	key: string;
	description: string;
	leadId: string;
	icon: string;
	memberIds: string[] | null;
}

export interface ProjectResponse {
	id: string;
	name: string;
	key: string;
	description: string;
	lead: IUser;
	members: IUser[] | null;
	icon: string;
	createAt: Date;
	updateAt: Date;
}
