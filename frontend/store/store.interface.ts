import { IAuthUser } from "@/types/auth.interface";
import { IUser } from "@/types/user.interface";
import { IProjectWithMembershipResponse } from "@/types/project.interface";

export interface IReduxState {
	authUser: IAuthUser;
	user: IUser;
	logout: boolean;
	project: {
		items: IProjectWithMembershipResponse[];
		selectedProjectId: string | null;
	};
}
