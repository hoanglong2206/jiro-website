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
