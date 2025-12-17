import { createSlice, Slice } from "@reduxjs/toolkit";

import { IAuthUser, IReduxAddAuthUser } from "@/types/auth.interface";

const initialValue: IAuthUser = {
	id: null,
	username: null,
	email: null,
	passwordResetExpires: null,
	passwordResetToken: null,
	profilePicture: null,
	createdAt: null,
	updatedAt: null,
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
				state.passwordResetToken = authInfo.passwordResetToken ?? null;
				state.passwordResetExpires = authInfo.passwordResetExpires ?? null;
				state.createdAt = authInfo.createdAt ?? null;
				state.updatedAt = authInfo.updatedAt ?? null;
			}
		},
		clearAuthUser: () => {
			return initialValue;
		},
	},
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
