"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getDataFromSessionStorage } from "@/services/utils.service";

export const useCheckAuthenticated = (): void => {
	const router = useRouter();

	const preventAuthRouteAccess = useCallback(() => {
		const isAuthenticated = Boolean(getDataFromSessionStorage("username"));

		if (isAuthenticated) {
			router.replace("/for-you");
		}
	}, [router]);

	useEffect(() => {
		preventAuthRouteAccess();
	}, [preventAuthRouteAccess]);
};
