import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { getDataFromSessionStorage } from "@/services/utils.service";

const BASE_ENDPOINT =
	process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5001";

const baseQuery = fetchBaseQuery({
	baseUrl: `${BASE_ENDPOINT}/api/`,
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");
		const token = getDataFromSessionStorage("token");
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
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
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const username = getDataFromSessionStorage("username");
		await baseQuery(`auth/refresh-token/${username}`, api, extraOptions);
	}

	return result;
};

export const api = createApi({
	reducerPath: "clientApi",
	baseQuery: baseQueryWithReAuth,
	tagTypes: ["Auth"],
	endpoints: () => ({}),
});
