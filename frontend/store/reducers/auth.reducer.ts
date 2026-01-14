import { createSlice, Slice } from "@reduxjs/toolkit";

import { IAuthUser, IReduxAddAuthUser } from "@/types/auth.interface";

const initialValue: IAuthUser = {
	id: "",
	fullname: "",
	username: "",
	email: "",
};

const authSlice: Slice = createSlice({
	name: "auth",
	initialState: initialValue,
	reducers: {
		addAuthUser: (state, action: IReduxAddAuthUser) => {
			const { authInfo } = action.payload;
			if (authInfo) {
				state.id = authInfo.id;
				state.fullname = authInfo.fullname;
				state.username = authInfo.username;
				state.email = authInfo.email;
			}
		},
		clearAuthUser: () => {
			return initialValue;
		},
	},
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
