export type ProjectType = "work" | "personal";
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectAccessLevel = "private" | "public";

export interface IProject {
	id: string;
	name: string;
	description?: string | null;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	ownerId: string;
	ownerEmail: string;
	ownerFullname: string;
	ownerProfilePicture?: string;
	ownerColorAvatar?: string;
	color?: string | null;
	icon?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateProjectPayload {
	name: string;
	description?: string | null;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	color?: string | null;
	icon?: string | null;
}

export interface IUpdateProjectPayload {
	name?: string;
	description?: string | null;
	type?: ProjectType;
	accessLevel?: ProjectAccessLevel;
	color?: string | null;
	icon?: string | null;
}
