"use client";

import { useState } from "react";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function Sidebar() {
	const pathname = usePathname();
	const [spacesOpen, setSpacesOpen] = useState(true);
	const [plansOpen, setPlansOpen] = useState(true);

	const starredProjects = projects.slice(0, 1);

	return (
		<aside className="flex max-h-[888px] w-64 flex-col bg-sidebar text-sidebar-foreground">
			<ScrollArea className="flex-1">
				<div className="p-2">
					<nav className="space-y-1">
						<Link
							href="/for-you"
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
								pathname === "/for-you" &&
									"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary",
							)}
						>
							<Home className="h-4 w-4" />
							For you
						</Link>
						<Popover>
							<PopoverTrigger asChild>
								<button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent cursor-pointer">
									<div className="flex items-center gap-3">
										<Clock className="h-4 w-4" />
										Recent
									</div>
									<ChevronRight className="h-4 w-4" />
								</button>
							</PopoverTrigger>
							<PopoverContent side="right" align="start" className="w-80 p-0">
								<div className="p-3">
									<h4 className="mb-3 text-sm font-medium">Recent</h4>
									<div className="space-y-1">
										{projects.map((project) => (
											<Link
												key={project.id}
												href={`/projects/${project.id}/board`}
												className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
											>
												<span
													className="flex h-6 w-6 items-center justify-center rounded text-xs"
													style={{ backgroundColor: project.color }}
												>
													{project.icon}
												</span>
												<span>{project.name}</span>
											</Link>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>
						<Popover>
							<PopoverTrigger asChild>
								<button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent cursor-pointer">
									<div className="flex items-center gap-3">
										<Star className="h-4 w-4" />
										Starred
									</div>
									<ChevronRight className="h-4 w-4" />
								</button>
							</PopoverTrigger>
							<PopoverContent side="right" align="start" className="w-80 p-0">
								<div className="p-3">
									<h4 className="mb-3 text-sm font-medium">Starred</h4>
									<div className="relative mb-3">
										<Input
											placeholder="Search starred items"
											className="h-8 pr-8 text-sm"
										/>
										<Filter className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									</div>
									<div className="space-y-1">
										{starredProjects.map((project) => (
											<Link
												key={project.id}
												href={`/projects/${project.id}/board`}
												className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent"
											>
												<div className="flex items-center gap-2">
													<span
														className="flex h-6 w-6 items-center justify-center rounded text-xs"
														style={{ backgroundColor: project.color }}
													>
														{project.icon}
													</span>
													<span>{project.name}</span>
												</div>
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											</Link>
										))}
									</div>
									<div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground hover:text-foreground">
										<Filter className="h-4 w-4" />
										View all starred items
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<Collapsible open={plansOpen} onOpenChange={setPlansOpen}>
							<div className="flex items-center">
								<CollapsibleTrigger asChild>
									<button className="flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent cursor-pointer">
										<Map className="h-4 w-4" />
										Plans
									</button>
								</CollapsibleTrigger>
								<div className="flex items-center gap-1 pr-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
									>
										<Plus className="h-3 w-3" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
									>
										<MoreHorizontal className="h-3 w-3" />
									</Button>
								</div>
							</div>
							<CollapsibleContent className="ml-6 space-y-1 text-sm text-sidebar-foreground/60">
								<Link
									href="/plans"
									className={cn(
										"flex items-center gap-2 rounded-md px-3 py-2 text-primary hover:bg-sidebar-accent transition-colors",
										pathname === "/plans" &&
											"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary",
									)}
								>
									<Filter className="h-4 w-4" />
									View all plans
								</Link>
							</CollapsibleContent>
						</Collapsible>
					</nav>

					{/* Spaces */}
					<Collapsible open={spacesOpen} onOpenChange={setSpacesOpen}>
						<div className="flex items-center">
							<CollapsibleTrigger asChild>
								<button className="flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent cursor-pointer">
									<FolderKanban className="h-4 w-4" />
									Spaces
								</button>
							</CollapsibleTrigger>
							<div className="flex items-center gap-1 pr-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
								>
									<Plus className="h-3 w-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 hover:bg-sidebar-accent cursor-pointer"
								>
									<MoreHorizontal className="h-3 w-3" />
								</Button>
							</div>
						</div>
						<CollapsibleContent className="space-y-1">
							{/* Starred */}
							<div className="space-y-2 pl-2">
								<h4 className="px-3 text-xs font-medium text-sidebar-foreground/50">
									Starred
								</h4>
								{starredProjects.map((project) => (
									<Link
										key={project.id}
										href={`/projects/${project.id}/board`}
										className={cn(
											"ml-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
											pathname.includes(`/projects/${project.id}`) &&
												"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary",
										)}
									>
										<span
											className="flex h-5 w-5 items-center justify-center rounded text-xs"
											style={{ backgroundColor: project.color }}
										>
											{project.icon}
										</span>
										<span className="truncate">{project.name}</span>
									</Link>
								))}
							</div>

							{/* Recent */}
							<div className="space-y-2 pl-2">
								<h4 className="px-3 text-xs font-medium text-sidebar-foreground/50">
									Recent
								</h4>
								{projects.slice(1).map((project) => (
									<Link
										key={project.id}
										href={`/projects/${project.id}/board`}
										className={cn(
											"ml-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
											pathname.includes(`/projects/${project.id}`) &&
												"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary",
										)}
									>
										<span
											className="flex h-5 w-5 items-center justify-center rounded text-xs"
											style={{ backgroundColor: project.color }}
										>
											{project.icon}
										</span>
										<span className="truncate">{project.name}</span>
									</Link>
								))}
							</div>

							{/* More spaces */}
							<Button
								variant={"ghost"}
								className="ml-4 flex items-center w-full gap-2 px-3 py-2 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground justify-start cursor-pointer"
							>
								<ChevronRight className="h-3 w-3" />
								More spaces
							</Button>
						</CollapsibleContent>
					</Collapsible>

					<nav className="mt-4 space-y-1">
						<div
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
								pathname === "/teams" && "bg-sidebar-accent",
							)}
						>
							<Users className="h-4 w-4" />
							Teams
							<ExternalLink className="ml-auto h-3 w-3 text-sidebar-foreground/50" />
						</div>
					</nav>
				</div>
			</ScrollArea>
		</aside>
	);
}
