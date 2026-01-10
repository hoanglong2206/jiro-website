export interface IAuthUser {
	id: string | null;
	fullname: string | null;
	username: string | null;
	email: string | null;
	profilePicture: string | null;
}

export interface ISignUpPayload {
	[key: string]: string | null | undefined;
	fullname: string;
	username: string;
	email: string;
	password: string;
}

export interface ISignInPayload {
	[key: string]: string | null | undefined;
	email: string;
	password: string;
}

export interface IChangePasswordPayload {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface IReduxAuthPayload {
	authInfo?: IAuthUser;
}

export interface IReduxAddAuthUser {
	type: string;
	payload: IReduxAuthPayload;
}

export interface IReduxLogout {
	type: string;
	payload: boolean;
}
