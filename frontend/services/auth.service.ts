import { api } from "@/store/api";
import {
	IChangePasswordPayload,
	ISignInPayload,
	ISignUpPayload,
} from "@/types/auth.interface";

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		register: build.mutation({
			query: (body: ISignUpPayload) => ({
				url: "auth/register",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Auth"],
		}),
		login: build.mutation({
			query: (body: ISignInPayload) => ({
				url: "auth/login",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Auth"],
		}),
		logout: build.mutation({
			query: () => ({
				url: "auth/logout",
				method: "POST",
			}),
			invalidatesTags: ["Auth"],
		}),
		getCurrentUser: build.query({
			query: () => "auth/me",
			providesTags: ["Auth"],
		}),
		changePassword: build.mutation({
			query: (body: IChangePasswordPayload) => ({
				url: "auth/change-password",
				method: "PUT",
				body,
			}),
			invalidatesTags: ["Auth"],
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useLogoutMutation,
	useGetCurrentUserQuery,
	useChangePasswordMutation,
} = authApi;
