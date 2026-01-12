"use client";

import {
	Bell,
	HelpCircle,
	Search,
	Settings,
	User,
	LogOut,
	Plus,
	Menu,
	MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearAuthUser } from "@/store/reducers/auth.reducer";
import { useLogoutMutation } from "@/services/auth.service";
import { useAppDispatch, useAppSelector, persister } from "@/store/store";
import {
	deleteFromLocalStorage,
	deleteFromSessionStorage,
} from "@/services/utils.service";
import { updateLogout } from "@/store/reducers/logout.reducer";
import { toast } from "sonner";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { AddTaskModal } from "./AddTaskModal";
import { useState } from "react";
import { clearAUser } from "@/store/reducers/user.reducer";
import { IUser } from "@/types/user.interface";

export function Header() {
	const router = useRouter();
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();
	const { toggleSidebar } = useSidebar();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const userInfo: IUser = useAppSelector((state) => state.user);

	const handleLogout = async (): Promise<void> => {
		try {
			await logout({}).unwrap();
			dispatch(clearAuthUser(null));
			dispatch(clearAUser(null));
			dispatch(updateLogout(true));
			deleteFromSessionStorage();
			deleteFromLocalStorage("user");

			await persister.purge();

			router.push("/login");
			toast.success("Đăng xuất thành công");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
		}
	};
	return (
		<>
			<header className="flex h-14 items-center justify-between border-b border-border bg-card px-8 gap-8 xl:gap-16">
				<div className="flex items-center gap-x-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						className="lg:hidden cursor-pointer border"
					>
						<Menu className="h-5 w-5" />
					</Button>
					<Link href="/for-you" className="items-center hidden md:flex">
						<Image
							src="/logo_l.svg"
							alt="Logo"
							width={100}
							height={100}
							loading="eager"
						/>
					</Link>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden cursor-pointer border"
					>
						<Search className="h-5 w-5" />
					</Button>
				</div>
				<div className="hidden md:flex flex-1 items-center justify-center gap-2 max-w-3xl">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search"
							className="h-9 pl-9 focus-visible:ring-primary"
						/>
					</div>
					<Button
						onClick={() => setIsModalOpen(true)}
						className="gap-2 cursor-pointer hidden lg:flex"
					>
						<Plus className="h-4 w-4" />
						Create
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant={"ghost"}
						size="icon"
						onClick={() => setIsModalOpen(true)}
						className="lg:hidden cursor-pointer border"
					>
						<Plus className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer md:hidden border"
					>
						<MoreHorizontal className="h-5 w-5" />
					</Button>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="cursor-pointer hidden md:flex"
							>
								<Bell className="h-5 w-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Notifications</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="cursor-pointer hidden md:flex"
							>
								<HelpCircle className="h-5 w-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Help</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="cursor-pointer hidden md:flex"
							>
								<Settings className="h-5 w-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Settings</p>
						</TooltipContent>
					</Tooltip>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="h-8 w-8 cursor-pointer hidden md:flex">
								<AvatarImage
									src={userInfo?.profilePicture || ""}
									alt={userInfo?.fullname || "r"}
								/>
								<AvatarFallback
									className="text-white"
									style={{ backgroundColor: userInfo?.colorAvatar || "" }}
								>
									{(userInfo?.fullname || "")
										.split(" ")
										.map((x) => x[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium">{userInfo?.fullname}</p>
									<p className="text-xs text-muted-foreground">
										{userInfo?.username}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/profile/me" className="cursor-pointer">
									<User className="mr-2 h-4 w-4" />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/profile/notifications" className="cursor-pointer">
									<Settings className="mr-2 h-4 w-4" />
									Account Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-red-500 focus:text-red-500 cursor-pointer"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
			<AddTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
