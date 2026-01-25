"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { IWorkspaceResponse } from "@/types/project.interface";
import { useAppDispatch } from "@/store/store";
import { setCurrentWorkspace } from "@/store/reducers/project.reducer";

interface SpaceNavCardProps {
	typeNav?: boolean;
	workspace?: IWorkspaceResponse;
	projectId?: string;
}

export const SpaceNavCard = ({
	typeNav = false,
	workspace,
	projectId,
}: SpaceNavCardProps) => {
	const pathname = usePathname();
	const dispatch = useAppDispatch();

	if (!workspace || !projectId) {
		return null;
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				className={cn(
					"text-sm cursor-pointer transition-colors flex items-center group",
					pathname.includes(
						`/projects/${projectId}/workspaces/${workspace.id}`,
					) && "bg-muted-foreground/5 hover:bg-muted-foreground/10 font-medium",
					typeNav && "group-has-data-[collapsible=icon]/sidebar-wrapper:hidden",
				)}
				asChild
			>
				<div className="flex items-center justify-between group/line">
					<Link
						href={`/projects/${projectId}/workspaces/${workspace.id}/board`}
						onClick={() => dispatch(setCurrentWorkspace(workspace))}
						className="flex items-center gap-2 truncate flex-1"
					>
						<div
							className="h-6 w-6 rounded flex items-center justify-center text-xs font-semibold text-background"
							style={{ backgroundColor: workspace.color || "#9ca3af" }}
						>
							{workspace.key}
						</div>
						<span className="truncate">{workspace.name}</span>
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
