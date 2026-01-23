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

export interface IWorkspace {
	projectId: string;
	name: string;
	key: string;
	color?: string | null;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	id: string;
}

export interface ICreateWorkspacePayload {
	name: string;
	key: string;
	color?: string | null;
}

export interface IUpdateWorkspacePayload {
	name?: string;
	key?: string;
	color?: string | null;
}

export interface IBoard {
	id: string;
	projectId: string;
	workspaceId: string;
	name: string;
	color?: string | null;
	position: number;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreateBoardPayload {
	name: string;
	color?: string | null;
	position?: number;
}

export interface IUpdateBoardPayload {
	name?: string;
	color?: string | null;
	position?: number;
}

export interface IWorkspacesResponse {
	workspaces: IWorkspace[];
}

export interface IWorkspaceDetailResponse {
	workspace: IWorkspace;
}

export interface IBoardsResponse {
	boards: IBoard[];
}

export interface IBoardDetailResponse {
	board: IBoard;
}
