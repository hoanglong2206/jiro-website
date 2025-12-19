import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import {
	deleteFromSessionStorage,
	getDataFromSessionStorage,
} from "@/services/utils.service";

const BASE_ENDPOINT =
	process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5001";

const baseQuery = fetchBaseQuery({
	baseUrl: `${BASE_ENDPOINT}/api/`,
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");

		if (typeof window !== "undefined") {
			const token = getDataFromSessionStorage("token");
			if (token && typeof token === "string") {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		return headers;
	},
	credentials: "include",
});

const baseQueryWithReAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	const username = getDataFromSessionStorage("username");

	if (username) {
		if (result.error && result.error.status === 401) {
			const refreshResult = await baseQuery(
				`auth/refresh-token/${username}`,
				api,
				extraOptions,
			);

			if (refreshResult.data && typeof window !== "undefined") {
				const { token: newToken } = refreshResult.data as { token?: string };
				if (newToken) {
					sessionStorage.setItem("token", JSON.stringify(newToken));
					result = await baseQuery(args, api, extraOptions);
				} else {
					deleteFromSessionStorage();
				}
			} else if (typeof window !== "undefined") {
				deleteFromSessionStorage();
			}
		}
	}

	return result;
};

export const api = createApi({
	reducerPath: "clientApi",
	baseQuery: baseQueryWithReAuth,
	tagTypes: ["Auth"],
	endpoints: () => ({}),
});
