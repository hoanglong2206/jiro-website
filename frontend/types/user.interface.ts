export interface IUser {
	id: string | null;
	fullname: string | null;
	username: string | null;
	email: string | null;
	profilePicture: string | null;
	colorAvatar: string | null;
	jobTitle: string | null;
}

export interface IUpdatedUserPayload {
	[key: string]: string | null | undefined;
	fullname: string;
	profilePicture: string;
	colorAvatar: string;
	jobTitle: string;
}

export interface IReduxUserPayload {
	userInfo?: IUser;
}

export interface IReduxUser {
	type: string;
	payload: IReduxUserPayload;
}

export interface IUserRequestInvite {
	id: string;
	fullname: string;
	username: string;
	email: string;
	status: "pending" | "accepted" | "rejected";
	profilePicture?: string;
	colorAvatar?: string;
	jobTitle?: string;
}
