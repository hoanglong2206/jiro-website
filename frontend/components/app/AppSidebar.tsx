"use client";

import { ElementType, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Home,
	Plus,
	ChevronsUpDown,
	Inbox,
	MessageSquareText,
	MoreHorizontal,
	Search,
	LayoutGrid,
	UsersRound,
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
import { useGetProjectsQuery } from "@/services/project.service";
import {
	setProjects,
	setSelectedProject,
} from "@/store/reducers/project.reducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IProjectWithMembershipResponse } from "@/types/project.interface";

const navigationItems: { label: string; icon: ElementType; href: string }[] = [
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
	{
		label: "Teams",
		icon: UsersRound,
		href: "teams",
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { items: projectItems, selectedProjectId } = useAppSelector(
		(state) => state.project,
	);
	const { data, isFetching } = useGetProjectsQuery();

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
			if (!selectedProjectId && data.projects.length) {
				dispatch(setSelectedProject(data.projects[0].project.id));
			}
		}
	}, [data, dispatch, selectedProjectId]);

	const memoizedMenuItems = useMemo(
		() =>
			navigationItems.map((item) => (
				<SidebarMenuItem key={item.label}>
					<SidebarMenuButton
						tooltip={item.label}
						className={cn(
							"flex items-center gap-3 text-sm cursor-pointer transition-colors",
							(item.href === "teams"
								? pathname.includes(item.href) ||
								  pathname.includes("people") ||
								  pathname.includes("analytics")
								: pathname.includes(item.href)) &&
								"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium",
						)}
						asChild
					>
						<Link href={`${item.href}`} className="flex items-center gap-2">
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			)),
		[pathname],
	);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProjectSwitcher
					projects={projectItems}
					isLoading={isFetching}
					selectedProjectId={selectedProjectId}
					onSelect={(id) => {
						if (!id) {
							dispatch(setSelectedProject(null));
							return;
						}
						dispatch(setSelectedProject(id));
						router.push(`/projects/${id}/home`);
					}}
				/>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>{memoizedMenuItems}</SidebarMenu>
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

interface ProjectSwitcherProps {
	projects: IProjectWithMembershipResponse[];
	isLoading: boolean;
	selectedProjectId: string | null;
	onSelect: (projectId: string | null) => void;
}

function ProjectSwitcher({
	projects,
	isLoading,
	selectedProjectId,
	onSelect,
}: ProjectSwitcherProps) {
	const { isMobile } = useSidebar();
	const selectedProject = projects.find(
		(project) => project.project.id === selectedProjectId,
	);
	const selectedDisplayName =
		selectedProject?.project.name ?? "Select a project";
	const selectedType = selectedProject?.project.type ?? "";

	const renderProjectIcon = (name: string) => {
		const initial = name ? name.charAt(0).toUpperCase() : "?";
		return (
			<div className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
				{initial}
			</div>
		);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{renderProjectIcon(selectedProject?.project.name ?? "")}
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{selectedDisplayName}
								</span>
								<span className="text-xs capitalize italic">
									{selectedType}
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
						{isLoading && (
							<DropdownMenuItem className="p-2 text-sm text-muted-foreground">
								Loading projects...
							</DropdownMenuItem>
						)}
						{!isLoading && projects.length === 0 && (
							<DropdownMenuItem className="p-2 text-sm text-muted-foreground">
								No projects found
							</DropdownMenuItem>
						)}
						{projects.map((project) => {
							const projectName = project.project.name;
							return (
								<DropdownMenuItem
									key={project.project.id}
									onClick={() => onSelect(project.project.id)}
									className="gap-2 p-2 cursor-pointer transition-colors"
								>
									<div className="flex size-6 items-center justify-center rounded-md border bg-transparent text-xs font-medium">
										{projectName.charAt(0).toUpperCase()}
									</div>
									{projectName}
								</DropdownMenuItem>
							);
						})}
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
