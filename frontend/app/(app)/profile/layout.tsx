"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileLayoutProps {
	children: React.ReactNode;
}

const sidebarItems: { label: string; href: string }[] = [
	{ label: "Profile", href: "/profile/me" },
	{ label: "Notifications", href: "/profile/notifications" },
	{ label: "Security", href: "/profile/security" },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
	const pathname = usePathname();
	return (
		<div className="mx-auto max-w-6xl p-8">
			<h1 className="text-2xl font-semibold text-foreground mb-8">
				Account settings
			</h1>
			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-75 shrink-0">
					<nav className="flex flex-row md:flex-col gap-1">
						{sidebarItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
										isActive
											? "bg-primary/10 text-primary font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-muted",
									)}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}
