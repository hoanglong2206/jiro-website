import { IAuthUser } from "@/types/auth.interface";

export interface IReduxState {
	authUser: IAuthUser;
	logout: boolean;
}
