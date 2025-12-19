"use client";

import {
	Bell,
	HelpCircle,
	Search,
	Settings,
	Sparkles,
	User,
	LogOut,
	Plus,
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
import { useAppDispatch } from "@/store/store";
import { deleteFromSessionStorage } from "@/services/utils.service";
import { updateLogout } from "@/store/reducers/logout.reducer";

export function Header() {
	const router = useRouter();
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();

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
	return (
		<header className="flex h-14 items-center justify-between border-b border-border bg-card px-8 gap-16">
			<div className="flex flex-1 items-center justify-between gap-x-2">
				<div className="lg:flex items-center hidden">
					<Image src="/logo_l.svg" alt="Logo" width={100} height={100} />
				</div>
				<div className="flex flex-1 items-center justify-center gap-2 max-w-2xl">
					<div className="relative w-full hidden lg:flex">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search"
							className="h-9 bg-muted pl-9 focus-visible:ring-primary"
						/>
					</div>
					<Button className="gap-2 cursor-pointer">
						<Plus className="h-4 w-4" />
						Create
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					className="gap-2 border-amber-500 text-amber-500 hover:bg-amber-500/10 bg-transparent hover:text-amber-500 cursor-pointer hidden md:flex"
				>
					<Sparkles className="h-4 w-4" />
					Premium trial
				</Button>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Bell className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Notifications</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<HelpCircle className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Help</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Settings className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Settings</p>
					</TooltipContent>
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="h-8 w-8 cursor-pointer">
							<AvatarImage src="/diverse-user-avatars.png" />
							<AvatarFallback className="bg-orange-500 text-white">
								LS
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">test</p>
								<p className="text-xs text-muted-foreground">test@test.com</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/profile" className="cursor-pointer">
								<User className="mr-2 h-4 w-4" />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/profile/notifications" className="cursor-pointer">
								<Bell className="mr-2 h-4 w-4" />
								Notifications
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
	);
}
