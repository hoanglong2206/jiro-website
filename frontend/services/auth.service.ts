import { api } from "@/store/api";
import {
	IChangePasswordPayload,
	IAuthResponse,
	ICurrentUserResponse,
	IMessageResponse,
	ISignInPayload,
	ISignUpPayload,
} from "@/types/auth.interface";

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		register: build.mutation<IAuthResponse, ISignUpPayload>({
			query: (body: ISignUpPayload) => ({
				url: "auth/register",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Auth"],
		}),
		login: build.mutation<IAuthResponse, ISignInPayload>({
			query: (body: ISignInPayload) => ({
				url: "auth/login",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Auth"],
		}),
		logout: build.mutation<IMessageResponse, void>({
			query: () => ({
				url: "auth/logout",
				method: "POST",
			}),
			invalidatesTags: ["Auth"],
		}),
		getCurrentUser: build.query<ICurrentUserResponse, void>({
			query: () => "auth/me",
			providesTags: ["Auth"],
		}),
		changePassword: build.mutation<IAuthResponse, IChangePasswordPayload>({
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
