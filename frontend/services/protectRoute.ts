"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { deleteFromSessionStorage } from "@/services/utils.service";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { useAppDispatch } from "@/store/store";
import { clearAuthUser } from "@/store/reducers/auth.reducer";
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
	const { isError, isFetching } = useGetCurrentUserQuery(undefined, {
		skip: typeof window === "undefined",
	});

	const enforceAuthentication = useCallback(() => {
		if (isError) {
			console.warn("Session expired. Redirecting to login.");
			dispatch(clearAuthUser(undefined));
			dispatch(updateLogout(true));
			deleteFromSessionStorage();
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
