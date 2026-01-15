export interface IAuthUser {
	id: string;
	fullname: string;
	username: string;
	email: string;
}

export interface IAuthResponse {
	message: string;
	user?: IAuthUser;
	token?: string;
}

export interface IMessageResponse {
	message: string;
}

export interface ICurrentUserResponse {
	user: IAuthUser;
}

export interface ISignUpPayload {
	fullname: string;
	username: string;
	email: string;
	password: string;
}

export interface ISignInPayload {
	email: string;
	password: string;
}

export interface IChangePasswordPayload {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface IReduxAuth {
	payload: {
		authInfo?: IAuthUser;
	};
}

export interface IReduxLogout {
	payload: boolean;
}
