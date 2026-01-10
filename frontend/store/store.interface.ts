import { IAuthUser } from "@/types/auth.interface";
import { IUser } from "@/types/user.interface";

export interface IReduxState {
	authUser: IAuthUser;
	user: IUser;
	logout: boolean;
}
