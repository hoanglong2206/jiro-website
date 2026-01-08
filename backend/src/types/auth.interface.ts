declare global {
	namespace Express {
		interface Request {
			currentUser?: IAuthPayload;
		}
	}
}

export interface IAuthPayload {
	id: string;
	fullname: string;
	username: string;
	email: string;
}

export interface IAuth {
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
	comparePassword(password: string, hashedPassword: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
}
