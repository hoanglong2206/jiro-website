export interface IUser {
	id: string;
	fullname: string;
	username: string;
	email: string;
	profilePicture?: string;
	colorAvatar?: string;
	jobTitle?: string;
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
