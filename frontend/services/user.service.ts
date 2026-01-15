import { api } from "@/store/api";
import type { IUser, IUpdatedUserPayload } from "@/types/user.interface";

export const userApi = api.injectEndpoints({
	endpoints: (build) => ({
		getUserByUsername: build.query<{ user: IUser }, string>({
			query: (username: string) => `user/username/${username}`,
			providesTags: ["User"],
		}),
		getUserByEmail: build.query<{ user: IUser }, string>({
			query: (email: string) => `user/email/${email}`,
			providesTags: ["User"],
		}),
		getAllUsers: build.query<{ users: IUser[] }, void>({
			query: () => `user/`,
			providesTags: ["User"],
		}),
		updateUser: build.mutation<
			{ message: string; user: IUser },
			IUpdatedUserPayload
		>({
			query: ({ userId, ...payload }) => ({
				url: `user/${userId}`,
				method: "PATCH",
				body: payload,
			}),
			invalidatesTags: ["User"],
		}),
	}),
});

export const {
	useGetUserByUsernameQuery,
	useGetUserByEmailQuery,
	useGetAllUsersQuery,
	useUpdateUserMutation,
} = userApi;
