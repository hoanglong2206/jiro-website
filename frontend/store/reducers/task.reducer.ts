import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITaskComment, ITaskWithDetails } from "@/types/task.interface";

interface TaskState {
	tasks: ITaskWithDetails[];
	currentTask: ITaskWithDetails | null;
	comments: ITaskComment[];
}

const initialState: TaskState = {
	tasks: [],
	currentTask: null,
	comments: [],
};

const taskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		setTasks: (state, action: PayloadAction<ITaskWithDetails[]>) => {
			state.tasks = action.payload;
		},
		addTask: (state, action: PayloadAction<ITaskWithDetails>) => {
			state.tasks = [...state.tasks, action.payload];
		},
		updateTaskLocal: (state, action: PayloadAction<ITaskWithDetails>) => {
			state.tasks = state.tasks.map((task) =>
				task.id === action.payload.id ? action.payload : task,
			);
			if (state.currentTask?.id === action.payload.id) {
				state.currentTask = action.payload;
			}
		},
		removeTask: (state, action: PayloadAction<string>) => {
			state.tasks = state.tasks.filter((task) => task.id !== action.payload);
			if (state.currentTask?.id === action.payload) {
				state.currentTask = null;
			}
		},
		setCurrentTask: (state, action: PayloadAction<ITaskWithDetails | null>) => {
			state.currentTask = action.payload;
		},
		setComments: (state, action: PayloadAction<ITaskComment[]>) => {
			state.comments = action.payload;
		},
		addComment: (state, action: PayloadAction<ITaskComment>) => {
			state.comments = [action.payload, ...state.comments];
		},
		updateCommentLocal: (state, action: PayloadAction<ITaskComment>) => {
			state.comments = state.comments.map((comment) =>
				comment.id === action.payload.id ? action.payload : comment,
			);
		},
		removeComment: (state, action: PayloadAction<string>) => {
			state.comments = state.comments.filter(
				(comment) => comment.id !== action.payload,
			);
		},
		clearTaskState: () => ({ ...initialState }),
	},
});

export const {
	setTasks,
	addTask,
	updateTaskLocal,
	removeTask,
	setCurrentTask,
	setComments,
	addComment,
	updateCommentLocal,
	removeComment,
	clearTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;
