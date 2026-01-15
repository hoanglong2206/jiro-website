"use client";

import { ElementType, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	Plus,
	ChevronsUpDown,
	Inbox,
	MessageSquareText,
	MoreHorizontal,
	Search,
	LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
	SidebarGroup,
	SidebarGroupLabel,
	useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ProjectResponse } from "@/types/project.interface";
import { IUser } from "@/types/user.interface";
import { mockUsers, mockProjects } from "@/lib/mockData";

const items: { label: string; icon: ElementType; href: string }[] = [
	{
		label: "Home",
		icon: Home,
		href: "home",
	},
	{
		label: "Inbox",
		icon: Inbox,
		href: "inbox",
	},
	{
		label: "Chat",
		icon: MessageSquareText,
		href: "chat",
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProjectSwitcher projects={mockProjects} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.label}>
								<SidebarMenuButton
									tooltip={item.label}
									className={cn(
										"flex items-center gap-3 text-sm cursor-pointer transition-colors",
										pathname.includes(item.href) &&
											"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium"
									)}
									asChild
								>
									<Link
										href={`${item.href}`}
										className="flex items-center gap-2"
									>
										<item.icon className="h-4 w-4" />
										{item.label}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel className="flex items-center justify-between">
						Spaces
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
							>
								<MoreHorizontal className="h-3 w-3" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
							>
								<Search className="h-3 w-3" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
							>
								<Plus className="h-3 w-3" />
							</Button>
						</div>
					</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip="Spaces"
								className="text-sm cursor-pointer transition-colors hidden group-has-data-[collapsible=icon]/sidebar-wrapper:flex"
							>
								<LayoutGrid className="h-4 w-4" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
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
								<span className="text-xs capitalize italic">
									{activeProject.type}
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
							Project
						</DropdownMenuLabel>
						{projects
							.filter(
								(project) => project.lead.id === currentUser.id
							)
							.map((project) => (
								<DropdownMenuItem
									key={project.name}
									onClick={() => setActiveProject(project)}
									className="gap-2 p-2 cursor-pointer transition-colors"
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
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
						<DropdownMenuItem className="gap-2 p-2 cursor-pointer">
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">
								Add new project
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
