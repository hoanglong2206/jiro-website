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
	fullname: string;
	profilePicture: string;
	colorAvatar: string;
	jobTitle: string;
}

export interface IReduxUser {
	payload: {
		userInfo?: IUser;
	};
}
