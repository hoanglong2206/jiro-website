import { IReduxUser, IUser } from "@/types/user.interface";
import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

const initialValue: IUser = {
	id: "",
	fullname: "",
	username: "",
	email: "",
	profilePicture: "",
	colorAvatar: "",
	jobTitle: "",
};

const userSlice: Slice = createSlice({
	name: "user",
	initialState: initialValue,
	reducers: {
		addAUser: (state, action: IReduxUser) => {
			const { userInfo } = action.payload;
			if (userInfo) {
				state.id = userInfo.id;
				state.fullname = userInfo.fullname;
				state.username = userInfo.username;
				state.email = userInfo.email;
				state.profilePicture = userInfo.profilePicture;
				state.colorAvatar = userInfo.colorAvatar;
				state.jobTitle = userInfo.jobTitle;
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
			>,
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

export const { addAUser, updateUser, clearAUser } = userSlice.actions;
export default userSlice.reducer;
