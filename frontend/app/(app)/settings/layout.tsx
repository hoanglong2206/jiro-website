"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileLayoutProps {
	children: React.ReactNode;
}

const sidebarItems: { label: string; href: string }[] = [
	{ label: "Profile", href: "profile" },
	{ label: "Notifications", href: "notifications" },
	{ label: "Security", href: "security" },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
	const pathname = usePathname();
	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
				<aside className="w-64 bg-accent/50 text-sidebar-foreground border-r border-sidebar-foreground/2 hidden lg:block">
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
										"flex items-center px-4 py-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
										isActive &&
											"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium"
									)}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
				</aside>
				<div className="flex items-center gap-1 border-b border-border lg:hidden">
					{sidebarItems.map((tab) => {
						const isActive = pathname.includes(tab.href);
						return (
							<Link
								key={tab.label}
								href={`${tab.href}`}
								className={cn(
									"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
								)}
							>
								{tab.label}
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
