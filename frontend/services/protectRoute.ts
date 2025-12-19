"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
	deleteFromSessionStorage,
	getDataFromSessionStorage,
	saveToSessionStorage,
} from "@/services/utils.service";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { useAppDispatch } from "@/store/store";
import { addAuthUser, clearAuthUser } from "@/store/reducers/auth.reducer";
import { updateLogout } from "@/store/reducers/logout.reducer";

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
	const { data, isError, isFetching, isSuccess } = useGetCurrentUserQuery(
		undefined,
		{ skip: typeof window === "undefined" },
	);

	const enforceAuthentication = useCallback(() => {
		if (isSuccess && data?.user) {
			dispatch(
				addAuthUser({
					authInfo: data.user,
				}),
			);
			const storedToken = getDataFromSessionStorage("token");
			saveToSessionStorage(
				JSON.stringify(true),
				JSON.stringify(data.user.username),
				typeof storedToken === "string" ? storedToken : undefined,
			);
			return;
		}

		if (isError) {
			console.warn("Session expired. Redirecting to login.");
			dispatch(clearAuthUser(undefined));
			dispatch(updateLogout(true));
			deleteFromSessionStorage();
			router.replace(redirectTo);
		}
	}, [isSuccess, data, isError, dispatch, router, redirectTo]);

	useEffect(() => {
		if (isFetching) {
			return;
		}
		enforceAuthentication();
	}, [enforceAuthentication, isFetching]);
};
