export interface IUser {
	id: string;
	fullname: string;
	username: string;
	email: string;
	profilePicture: string | null;
	colorAvatar: string;
	jobTitle: string | null;
}

export interface IUpdatedUserPayload {
	userId: string;
	fullname?: string;
	profilePicture?: string | null;
	colorAvatar?: string | null;
	jobTitle?: string | null;
}

export interface IReduxUser {
	payload: {
		userInfo?: IUser;
	};
}
