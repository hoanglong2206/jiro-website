import { createSlice, Slice } from "@reduxjs/toolkit";

import { IAuthUser, IReduxAddAuthUser } from "@/types/auth.interface";

const initialValue: IAuthUser = {
	id: null,
	username: null,
	email: null,
	profilePicture: null,
};

const authSlice: Slice = createSlice({
	name: "auth",
	initialState: initialValue,
	reducers: {
		addAuthUser: (state, action: IReduxAddAuthUser) => {
			const { authInfo } = action.payload;
			if (authInfo) {
				state.id = authInfo.id ?? null;
				state.username = authInfo.username ?? null;
				state.email = authInfo.email ?? null;
				state.profilePicture = authInfo.profilePicture ?? null;
			}
		},
		clearAuthUser: () => {
			return initialValue;
		},
	},
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
