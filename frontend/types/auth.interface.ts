export interface IAuthUser {
	id: number | null;
	username: string | null;
	email: string | null;
	profilePicture: string | null;
}

export interface IAuthDocument {
	id?: number;
	username?: string;
	email?: string;
	password?: string;
	profilePicture?: string;
	createdAt?: Date;
	updatedAt?: Date;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
}

export interface ISignUpPayload {
	[key: string]: string | null | undefined;
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
	authInfo?: IAuthDocument;
}

export interface IReduxAddAuthUser {
	type: string;
	payload: IReduxAuthPayload;
}

export interface IReduxLogout {
	type: string;
	payload: boolean;
}

export interface IAuthResponse {
	message: string;
}
