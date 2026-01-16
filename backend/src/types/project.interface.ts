export type ProjectType = "work" | "personal";
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectAcessLevel = "private" | "public";

export interface IProject {
	id: string;
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAcessLevel;
	ownerId: string;
	icon?: string;
	createdAt: Date;
	updatedAt: Date;
}
