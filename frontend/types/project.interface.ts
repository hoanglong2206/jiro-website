import { IUser } from "./user.interface";

export interface ProjectPayLoad {
	id: string;
	name: string;
	description: string;
	type: "work" | "personal";
	leadId: string;
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
