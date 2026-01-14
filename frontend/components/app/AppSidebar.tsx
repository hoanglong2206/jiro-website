"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ChevronRight,
	Clock,
	Filter,
	FolderKanban,
	Home,
	Map,
	MoreHorizontal,
	Plus,
	Star,
	Users,
	ExternalLink,
	X,
	Bell,
	ChevronsUpDown,
	Inbox,
	MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ProjectResponse } from "@/types/project.interface";
import { IUser } from "@/types/user.interface";
import { mockUsers, mockProjects } from "@/lib/mockData";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const [spacesOpen, setSpacesOpen] = useState(true);

	const starredProjects = projects.slice(0, 1);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProjectSwitcher projects={mockProjects} />
			</SidebarHeader>
			<SidebarContent>
				<div className="p-2">
					<Link
						href={`home`}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
							pathname.includes("home") &&
								"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary font-medium"
						)}
					>
						<Home className="h-4 w-4" />
						Home
					</Link>
					<Link
						href={`inbox`}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
							pathname.includes("inbox") &&
								"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary font-medium"
						)}
					>
						<Inbox className="h-4 w-4" />
						Inbox
					</Link>
					<Link
						href={`home`}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
							pathname.includes("chat") &&
								"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary font-medium"
						)}
					>
						<MessageSquareText className="h-4 w-4" />
						Chat
					</Link>

					<Link
						href={`teams`}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent cursor-pointer",
							(pathname.includes("teams") ||
								pathname.includes("analytics") ||
								pathname.includes("people")) &&
								"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary font-medium"
						)}
					>
						<Users className="h-4 w-4" />
						Teams
						<ExternalLink className="ml-auto h-3 w-3 text-sidebar-foreground/50" />
					</Link>
				</div>
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function ProjectSwitcher({ projects }: { projects: ProjectResponse[] }) {
	const currentUser: IUser = useMemo(() => mockUsers[3], []);
	const initProject: ProjectResponse = useMemo(
		() =>
			projects.filter((project) => project.lead.id === currentUser.id)[0],
		[currentUser, projects]
	);
	const [activeProject, setActiveProject] = useState<ProjectResponse | null>(
		initProject
	);
	const { isMobile } = useSidebar();
	if (!activeProject) {
		return null;
	}
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-muted-foreground/40  flex aspect-square size-8 items-center justify-center rounded-lg">
								<Image
									src={activeProject.icon}
									alt={activeProject.name}
									width={15}
									height={15}
								/>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeProject.name}
								</span>
								<span className="truncate text-xs">
									{activeProject.key}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="min-w-64 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Teams
						</DropdownMenuLabel>
						{projects
							.filter(
								(project) => project.lead.id === currentUser.id
							)
							.map((project) => (
								<DropdownMenuItem
									key={project.name}
									onClick={() => setActiveProject(project)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-md border cursor-pointer">
										<Image
											src={project.icon}
											alt={project.name}
											width={15}
											height={15}
										/>
									</div>
									{project.name}
								</DropdownMenuItem>
							))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">
								Add team
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
