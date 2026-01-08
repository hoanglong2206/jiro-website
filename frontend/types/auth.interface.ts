export interface IAuthUser {
	id: string | null;
	fullname: string | null;
	username: string | null;
	email: string | null;
	profilePicture: string | null;
}

export interface IAuthDocument {
	id?: string;
	fullname?: string;
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
