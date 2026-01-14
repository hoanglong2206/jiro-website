import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectResponse } from "@/types/project.interface";

interface ProjectState {
	items: ProjectResponse[];
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
		setProjects: (state, action: PayloadAction<ProjectResponse[]>) => {
			state.items = action.payload;
			if (!state.selectedProjectId && action.payload.length) {
				state.selectedProjectId = action.payload[0].id;
			}
		},
		addProject: (state, action: PayloadAction<ProjectResponse>) => {
			state.items.unshift(action.payload);
			state.selectedProjectId = action.payload.id;
		},
		updateProject: (state, action: PayloadAction<ProjectResponse>) => {
			const index = state.items.findIndex(
				(project) => project.id === action.payload.id,
			);
			if (index >= 0) {
				state.items[index] = action.payload;
			}
		},
		removeProject: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(
				(project) => project.id !== action.payload,
			);
			if (state.selectedProjectId === action.payload) {
				state.selectedProjectId = state.items[0]?.id ?? null;
			}
		},
		setSelectedProject: (state, action: PayloadAction<string | null>) => {
			state.selectedProjectId = action.payload;
		},
	},
});

export const {
	setProjects,
	addProject,
	updateProject,
	removeProject,
	setSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;
