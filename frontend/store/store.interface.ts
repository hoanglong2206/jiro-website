import { IAuthUser } from "@/types/auth.interface";
import { IUser } from "@/types/user.interface";
import { IProjectResponse } from "@/types/project.interface";
import { ITaskComment, ITaskWithDetails } from "@/types/task.interface";

export interface IReduxState {
	authUser: IAuthUser;
	user: IUser;
	logout: boolean;
	project: {
		projects: IProjectResponse[];
		currentProject: IProjectResponse | null;
	};
	task: {
		tasks: ITaskWithDetails[];
		currentTask: ITaskWithDetails | null;
		comments: ITaskComment[];
	};
}
