import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	IProjectResponse,
	IWorkspaceResponse,
} from "@/types/project.interface";

interface ProjectState {
	projects: IProjectResponse[];
	currentProject: IProjectResponse | null;
	workspaces: IWorkspaceResponse[];
	currentWorkspace: IWorkspaceResponse | null;
}

const initialState: ProjectState = {
	projects: [],
	currentProject: null,
	workspaces: [],
	currentWorkspace: null,
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
		setWorkspaces: (state, action: PayloadAction<IWorkspaceResponse[]>) => {
			state.workspaces = action.payload;
		},
		addWorkspace: (state, action: PayloadAction<IWorkspaceResponse>) => {
			state.workspaces = [...state.workspaces, action.payload];
		},
		setCurrentWorkspace: (state, action: PayloadAction<IWorkspaceResponse>) => {
			state.currentWorkspace = action.payload;
		},
		clearCurrentWorkspace: (state) => {
			state.currentWorkspace = null;
		},
		clearProjects: () => ({ ...initialState }),
	},
});

export const {
	setProjects,
	addProject,
	setCurrentProject,
	clearCurrentProject,
	setWorkspaces,
	addWorkspace,
	setCurrentWorkspace,
	clearCurrentWorkspace,
	clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
