export interface IUser {
	id: string;
	fullname: string;
	username: string;
	email: string;
	profilePicture: string;
	colorAvatar: string;
	jobTitle: string;
}

export interface IUpdatedUserPayload {
	userId: string;
	fullname?: string;
	profilePicture?: string;
	colorAvatar?: string;
	jobTitle?: string;
}

export interface IReduxUser {
	payload: {
		userInfo?: IUser;
	};
}
