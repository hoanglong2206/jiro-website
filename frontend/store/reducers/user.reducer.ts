import { IReduxUser, IUser } from "@/types/user.interface";
import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

const initialValue: IUser = {
	id: null,
	fullname: null,
	username: null,
	email: null,
	profilePicture: null,
	colorAvatar: null,
	jobTitle: null,
};

const userSlice: Slice = createSlice({
	name: "user",
	initialState: initialValue,
	reducers: {
		addAUser: (state, action: IReduxUser) => {
			const { userInfo } = action.payload;
			if (userInfo) {
				state.id = userInfo.id ?? null;
				state.fullname = userInfo.fullname ?? null;
				state.username = userInfo.username ?? null;
				state.email = userInfo.email ?? null;
				state.profilePicture = userInfo.profilePicture ?? null;
				state.colorAvatar = userInfo.colorAvatar ?? null;
				state.jobTitle = userInfo.jobTitle ?? null;
			}
		},
		updateUser: (
			state,
			action: PayloadAction<
				Partial<
					Pick<
						IUser,
						| "fullname"
						| "profilePicture"
						| "colorAvatar"
						| "jobTitle"
					>
				>
			>
		) => {
			if (action.payload.fullname !== undefined) {
				state.fullname = action.payload.fullname;
			}
			if (action.payload.profilePicture !== undefined) {
				state.profilePicture = action.payload.profilePicture;
			}
			if (action.payload.colorAvatar !== undefined) {
				state.colorAvatar = action.payload.colorAvatar;
			}
			if (action.payload.jobTitle !== undefined) {
				state.jobTitle = action.payload.jobTitle;
			}
		},
		clearAUser: () => {
			return initialValue;
		},
	},
});

export const { addAUser, clearAUser } = userSlice.actions;
export default userSlice.reducer;
