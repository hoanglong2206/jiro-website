"use client";

import { cn } from "@/lib/utils";
import { Bell, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

interface ProfileLayoutProps {
	children: React.ReactNode;
}

const sidebarItems: { label: string; href: string; icon: ElementType }[] = [
	{ label: "Profile", href: "profile", icon: UserRound },
	{ label: "Notifications", href: "notifications", icon: Bell },
	{ label: "Security", href: "security", icon: Shield },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
	const pathname = usePathname();
	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-1 flex-col xl:flex-row overflow-hidden py-1">
				<aside className="w-64 bg-accent/50 text-sidebar-foreground border-r border-sidebar-foreground/2 hidden xl:block">
					<header className="px-4 py-4 flex items-center justify-between">
						<h1 className="text-xl font-semibold">Settings</h1>
					</header>
					<nav className="mt-2 px-3 space-y-1.5">
						{sidebarItems.map((item) => {
							const isActive = pathname.includes(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex items-center px-4 py-2 gap-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
										isActive &&
											"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium"
									)}
								>
									<item.icon className="h-4 w-4" />
									{item.label}
								</Link>
							);
						})}
					</nav>
				</aside>
				<div className="flex items-center gap-1 px-8 border-b border-border xl:hidden">
					{sidebarItems.map((item) => {
						const isActive = pathname.includes(item.href);
						return (
							<Link
								key={item.label}
								href={`${item.href}`}
								className={cn(
									"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
								)}
							>
								{item.label}
								<item.icon className="h-4 w-4" />
							</Link>
						);
					})}
				</div>
				<div className="flex-1 flex flex-col px-8 py-4 overflow-y-auto">
					{children}
				</div>
			</div>
		</div>
	);
}
