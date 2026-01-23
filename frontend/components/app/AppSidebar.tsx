"use client";

import { ElementType, useEffect, useMemo, useRef, useState } from "react";
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
import {
	setCurrentProject,
	clearCurrentProject,
} from "@/store/reducers/project.reducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IProjectResponse } from "@/types/project.interface";
import Image from "next/image";
import {
	saveToLocalStorage,
	getDataFromLocalStorage,
} from "@/services/utils.service";
import { SpaceNavCard, CreateSpaceModal } from "@/components/app";

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
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { currentProject } = useAppSelector((state) => state.project);

	useEffect(() => {
		if (!projects.length) {
			dispatch(clearCurrentProject());
			return;
		}

		if (
			currentProject &&
			projects.some((item) => item.id === currentProject.id)
		) {
			return;
		}

		const storedProject = (() => {
			try {
				return getDataFromLocalStorage(
					"currentProject",
				) as IProjectResponse | null;
			} catch {
				return null;
			}
		})();

		const fallbackProject =
			storedProject &&
			projects.some((item) => item.id === storedProject.id)
				? storedProject
				: projects[0];

		if (fallbackProject) {
			dispatch(setCurrentProject(fallbackProject));
			saveToLocalStorage(
				"currentProject",
				JSON.stringify(fallbackProject),
			);
		}
	}, [projects, currentProject, dispatch]);

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
						<Link
							href={`${item.href}`}
							className="flex items-center gap-2"
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			)),
		[pathname],
	);

	const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] =
		useState<boolean>(false);
	const [isSpacesSheetOpen, setIsSpacesSheetOpen] = useState<boolean>(false);
	const [isDropdownSheetOpen, setIsDropdownSheetOpen] =
		useState<boolean>(false);

	const asideRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isSpacesSheetOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (isDropdownSheetOpen || isCreateSpaceModalOpen) return;

			if (dropdownRef.current && !dropdownRef.current.contains(target))
				return;

			if (
				asideRef.current &&
				!asideRef.current.contains(target) &&
				triggerRef.current &&
				!triggerRef.current.contains(target)
			) {
				setIsSpacesSheetOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isSpacesSheetOpen, isDropdownSheetOpen, isCreateSpaceModalOpen]);

	return (
		<>
			<Sidebar collapsible="icon" {...props}>
				<SidebarHeader>
					<ProjectSwitcher
						projects={projects}
						currentProject={currentProject}
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
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
										>
											<MoreHorizontal className="h-3 w-3" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="w-48"
									>
										<DropdownMenuItem
											onClick={() =>
												setIsCreateSpaceModalOpen(true)
											}
											className="cursor-pointer"
										>
											<Plus className="h-4 w-4" />
											Create Space
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer">
											<LayoutGrid className="h-4 w-4" />
											Manage Spaces
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
								>
									<Search className="h-3 w-3" />
								</Button>
								<Button
									onClick={() =>
										setIsCreateSpaceModalOpen(true)
									}
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
									ref={triggerRef}
									onClick={() =>
										setIsSpacesSheetOpen(!isSpacesSheetOpen)
									}
									className={cn(
										"text-sm cursor-pointer transition-colors hidden group-has-data-[collapsible=icon]/sidebar-wrapper:flex",
										isSpacesSheetOpen &&
											"bg-muted-foreground/10",
									)}
								>
									<LayoutGrid className="h-4 w-4" />
								</SidebarMenuButton>
							</SidebarMenuItem>
							{Array.from({ length: 3 }).map((_, index) => (
								<SpaceNavCard key={index} typeNav />
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter></SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<aside
				ref={asideRef}
				className={cn(
					"fixed hidden left-11.75 top-13.75 border z-1 bg-sidebar md:flex h-full w-64 p-2 flex-col overflow-y-hidden duration-300 ease-in-out gap-2",
					isSpacesSheetOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<SidebarGroupLabel className="flex items-center justify-between">
					Spaces
					<div className="flex items-center gap-1">
						<DropdownMenu onOpenChange={setIsDropdownSheetOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
								>
									<MoreHorizontal className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								ref={dropdownRef}
								align="start"
								className="w-48"
							>
								<DropdownMenuItem
									onClick={() =>
										setIsCreateSpaceModalOpen(true)
									}
									className="cursor-pointer"
								>
									<Plus className="h-4 w-4" />
									Create Space
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<LayoutGrid className="h-4 w-4" />
									Manage Spaces
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
						>
							<Search className="h-3 w-3" />
						</Button>
						<Button
							onClick={() => setIsCreateSpaceModalOpen(true)}
							variant="ghost"
							size="icon"
							className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>
				</SidebarGroupLabel>
				<div className="flex flex-col gap-1">
					{Array.from({ length: 3 }).map((_, index) => (
						<SpaceNavCard key={index} />
					))}
				</div>
			</aside>
			<CreateSpaceModal
				isOpen={isCreateSpaceModalOpen}
				onClose={() => setIsCreateSpaceModalOpen(false)}
				projectId={currentProject?.id}
			/>
		</>
	);
}

interface ProjectSwitcherProps {
	projects: IProjectResponse[];
	currentProject: IProjectResponse | null;
}

function ProjectSwitcher({ projects, currentProject }: ProjectSwitcherProps) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const dispatch = useAppDispatch();

	const renderProjectIcon = (name: string, color?: string | null) => {
		const initials = name
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase())
			.join("");
		return (
			<div
				className="flex aspect-square size-8 items-center justify-center rounded-md text-background"
				style={{ backgroundColor: color || "#1f2937" }}
			>
				{initials}
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
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
						>
							{currentProject?.icon ? (
								<Image
									src={currentProject.icon}
									alt={currentProject.name ?? "Project icon"}
									width={32}
									height={32}
									className="rounded-md"
								/>
							) : (
								renderProjectIcon(
									currentProject?.name ?? "",
									currentProject?.color,
								)
							)}

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{currentProject?.name ?? "No project"}
								</span>
								<span className="text-xs capitalize italic">
									{currentProject?.type ?? "unknown"}
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
						{projects.map((project) => {
							const projectName = project.name;
							return (
								<DropdownMenuItem
									key={project.id}
									onClick={() => {
										dispatch(setCurrentProject(project));
										saveToLocalStorage(
											"currentProject",
											JSON.stringify(project),
										);
										router.push(
											`/projects/${project.id}/home`,
										);
									}}
									className="gap-2 cursor-pointer transition-colors"
								>
									{project.icon ? (
										<Image
											src={project.icon}
											alt={projectName}
											width={32}
											height={32}
											className="rounded-md"
										/>
									) : (
										renderProjectIcon(
											projectName,
											project.color,
										)
									)}

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
