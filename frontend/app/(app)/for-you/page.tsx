"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearAuthUser } from "@/store/reducers/auth.reducer";
import { useLogoutMutation } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { deleteFromSessionStorage } from "@/services/utils.service";
import { updateLogout } from "@/store/reducers/logout.reducer";
import { IReduxState } from "@/store/store.interface";

const ForYouPage = () => {
	const router = useRouter();
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();
	const appLogout = useAppSelector((state: IReduxState) => state.logout);

	const handleLogout = async (): Promise<void> => {
		try {
			await logout({}).unwrap();
			dispatch(clearAuthUser(undefined));
			dispatch(updateLogout(true));
			deleteFromSessionStorage();
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handleClick = (): void => {
		console.log("Logout state:", appLogout);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<Button variant="outline" onClick={handleLogout}>
					Logout
				</Button>
				<Button variant="outline" onClick={handleClick}>
					Click
				</Button>
			</div>
		</div>
	);
};

export default ForYouPage;
