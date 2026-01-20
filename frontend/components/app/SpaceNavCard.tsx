"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { HandFist, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface SpaceNavCardProps {
	typeNav?: boolean;
}

export const SpaceNavCard = ({ typeNav = false }: SpaceNavCardProps) => {
	const pathname = usePathname();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				className={cn(
					"text-sm cursor-pointer transition-colors flex items-center group",
					pathname.includes("board") &&
						"bg-muted-foreground/5 hover:bg-muted-foreground/10 font-medium",
					typeNav &&
						"group-has-data-[collapsible=icon]/sidebar-wrapper:hidden",
				)}
				asChild
			>
				<div className="flex items-center justify-between group/line">
					<Link
						href={`board`}
						className="flex items-center gap-2 truncate"
					>
						<HandFist className="h-4 w-4" />
						Genshin Impact
					</Link>
					<div className="flex items-center gap-1 opacity-0 group-hover/line:opacity-100">
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"h-6 w-6 hover:bg-muted-foreground/5 cursor-pointer",
							)}
						>
							<MoreHorizontal className="h-3 w-3" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"h-6 w-6 hover:bg-muted-foreground/5 cursor-pointer",
							)}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
