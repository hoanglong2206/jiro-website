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
import { useGetUserByUsernameQuery } from "../services/user.service";

export const useProtectRoute = (): void => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { data, isError, isFetching } = useGetCurrentUserQuery(undefined);
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
			deleteFromLocalStorage("currentProject");
			router.replace("/login");
		}
	}, [isError, dispatch, router]);

	useEffect(() => {
		if (isFetching) {
			return;
		}
		enforceAuthentication();
	}, [enforceAuthentication, isFetching]);
};
