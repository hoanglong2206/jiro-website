import { IAuthUser } from "@/types/auth.interface";
import { IUser } from "@/types/user.interface";
import { IProjectResponse } from "@/types/project.interface";

export interface IReduxState {
	authUser: IAuthUser;
	user: IUser;
	logout: boolean;
	project: {
		projects: IProjectResponse[];
		currentProject: IProjectResponse | null;
	};
}
