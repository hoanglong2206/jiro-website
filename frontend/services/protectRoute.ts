"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
	deleteFromLocalStorage,
	deleteFromSessionStorage,
	saveToLocalStorage,
} from "@/services/utils.service";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { useAppDispatch } from "@/store/store";
import { clearAuthUser } from "@/store/reducers/auth.reducer";
import { updateLogout } from "@/store/reducers/logout.reducer";
import { addAUser, clearAUser } from "@/store/reducers/user.reducer";
import { useGetUserByUsernameQuery } from "./user.service";

/**
 * useProtectRoute
 * Redirects unauthenticated users to the login page.
 * Checks for a `token` in sessionStorage set during login.
 *
 * @param redirectTo Path to redirect when unauthenticated (default: "/login")
 */
export const useProtectRoute = (redirectTo = "/login"): void => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { data, isError, isFetching } = useGetCurrentUserQuery({});
	const username = data?.user?.username;

	const { data: result, isSuccess: isUserSuccess } =
		useGetUserByUsernameQuery(username as string, {
			skip: !username,
		});

	useEffect(() => {
		if (isUserSuccess && result) {
			dispatch(addAUser({ userInfo: result.user }));
			saveToLocalStorage("user", JSON.stringify(result));
		}
	}, [isUserSuccess, result, dispatch]);

	const enforceAuthentication = useCallback(() => {
		if (isError) {
			console.warn("Session expired. Redirecting to login.");
			dispatch(clearAuthUser(null));
			dispatch(clearAUser(null));
			dispatch(updateLogout(true));
			deleteFromSessionStorage();
			deleteFromLocalStorage("user");
			router.replace(redirectTo);
		}
	}, [isError, dispatch, router, redirectTo]);

	useEffect(() => {
		if (isFetching) {
			return;
		}
		enforceAuthentication();
	}, [enforceAuthentication, isFetching]);
};
