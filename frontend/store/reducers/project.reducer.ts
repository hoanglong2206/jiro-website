import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectResponse } from "@/types/project.interface";

interface ProjectState {
	projects: IProjectResponse[];
	currentProject: IProjectResponse | null;
}

const initialState: ProjectState = {
	projects: [],
	currentProject: null,
};

const projectSlice = createSlice({
	name: "project",
	initialState,
	reducers: {
		setProjects: (state, action: PayloadAction<IProjectResponse[]>) => {
			state.projects = action.payload;
		},
		addProject: (state, action: PayloadAction<IProjectResponse>) => {
			state.projects = [...state.projects, action.payload];
		},
		setCurrentProject: (state, action: PayloadAction<IProjectResponse>) => {
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
