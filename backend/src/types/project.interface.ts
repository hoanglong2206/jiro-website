export type ProjectType = "work" | "personal";
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectAccessLevel = "private" | "public";

export interface IProject {
	id: string;
	name: string;
	description?: string;
	type: ProjectType;
	accessLevel: ProjectAccessLevel;
	ownerId: string;
	ownerEmail: string;
	ownerFullname: string;
	ownerProfilePicture?: string | null;
	ownerColorAvatar?: string | null;
	color?: string | null;
	icon?: string | null;
	createdAt: Date;
	updatedAt: Date;
}
