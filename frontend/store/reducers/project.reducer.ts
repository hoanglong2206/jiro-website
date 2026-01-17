import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectWithMembershipResponse } from "@/types/project.interface";

interface ProjectState {
	projects: IProjectWithMembershipResponse[];
	currentProject: IProjectWithMembershipResponse | null;
}

const initialState: ProjectState = {
	projects: [],
	currentProject: null,
};

const projectSlice = createSlice({
	name: "project",
	initialState,
	reducers: {
		setProjects: (
			state,
			action: PayloadAction<IProjectWithMembershipResponse[]>
		) => {
			state.projects = action.payload;
		},
		addProject: (
			state,
			action: PayloadAction<IProjectWithMembershipResponse>
		) => {
			state.projects = [...state.projects, action.payload];
		},
		setCurrentProject: (
			state,
			action: PayloadAction<IProjectWithMembershipResponse>
		) => {
			state.currentProject = action.payload;
		},
		clearCurrentProject: (state) => {
			state.currentProject = null;
		},
		clearProjects: () => ({ ...initialState }),
	},
});

export const {
	setProjects,
	addProject,
	setCurrentProject,
	clearCurrentProject,
	clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
