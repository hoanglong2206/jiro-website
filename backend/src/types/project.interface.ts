export type ProjectType = "work" | "personal";
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";

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
