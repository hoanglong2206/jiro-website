import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectWithMembershipResponse } from "@/types/project.interface";

interface ProjectState {
	items: IProjectWithMembershipResponse[];
	selectedProjectId: string | null;
}

const initialState: ProjectState = {
	items: [],
	selectedProjectId: null,
};

const projectSlice = createSlice({
	name: "project",
	initialState,
	reducers: {
		setProjects: (
			state,
			action: PayloadAction<IProjectWithMembershipResponse[]>,
		) => {
			state.items = action.payload;
		},
		addProject: (
			state,
			action: PayloadAction<IProjectWithMembershipResponse>,
		) => {
			state.items = [
				action.payload,
				...state.items.filter(
					(item) => item.project.id !== action.payload.project.id,
				),
			];
		},
		setSelectedProject: (state, action: PayloadAction<string | null>) => {
			state.selectedProjectId = action.payload;
		},
		clearProjects: () => ({ ...initialState }),
	},
});

export const { setProjects, addProject, setSelectedProject, clearProjects } =
	projectSlice.actions;

export default projectSlice.reducer;
