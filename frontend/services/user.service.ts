import { api } from "@/store/api";

export const userApi = api.injectEndpoints({
	endpoints: (build) => ({
		getUserByUsername: build.query({
			query: (username: string) => `user/username/${username}`,
			providesTags: ["User"],
		}),
		getUserByEmail: build.query({
			query: (email: string) => `user/email/${email}`,
			providesTags: ["User"],
		}),
		getAllUsers: build.query({
			query: () => `user/`,
			providesTags: ["User"],
		}),
	}),
});

export const {
	useGetUserByUsernameQuery,
	useGetUserByEmailQuery,
	useGetAllUsersQuery,
} = userApi;
