"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
	Calendar,
	Fullscreen,
	ImageIcon,
	KanbanSquare,
	LayoutList,
	LineChart,
	MoreHorizontal,
	Plus,
	Settings,
	Share2,
	Star,
	Timer,
	Trash2,
	UserPlus,
	Users,
	Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
	project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
	const pathname = usePathname();
	const baseUrl = `/projects/${project.id}`;
	const [isStarred, setIsStarred] = useState(true);

	const tabs = [
		{ name: "Summary", href: `${baseUrl}/summary`, icon: LineChart },
		{ name: "List", href: `${baseUrl}/list`, icon: LayoutList },
		{ name: "Board", href: `${baseUrl}/board`, icon: KanbanSquare },
		{ name: "Calendar", href: `${baseUrl}/calendar`, icon: Calendar },
		{ name: "Timeline", href: `${baseUrl}/timeline`, icon: Timer },
	];

	return (
		<div className="border-b border-border bg-card">
			<div className="flex items-center justify-between px-6 py-4">
				<div className="flex flex-col items-start gap-3">
					<div className="text-sm text-muted-foreground font-medium">
						Spaces
					</div>
					<div className="flex items-center gap-2">
						<span
							className="flex h-7 w-7 items-center justify-center rounded text-sm"
							style={{ backgroundColor: project.color }}
						>
							{project.icon}
						</span>
						<h1 className="text-xl font-semibold"> {project.name}</h1>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Users className="h-5 w-5" />
						</Button>

						<DropdownMenu>
							<Tooltip>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="cursor-pointer"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>More actions</p>
								</TooltipContent>
							</Tooltip>
							<DropdownMenuContent align="start" className="w-56">
								<DropdownMenuItem onClick={() => setIsStarred(!isStarred)}>
									<Star
										className={cn(
											"mr-2 h-4 w-4",
											isStarred && "fill-yellow-400 text-yellow-400",
										)}
									/>
									{isStarred ? "Remove from starred" : "Add to starred"}
								</DropdownMenuItem>
								<DropdownMenuItem>
									<UserPlus className="mr-2 h-4 w-4" />
									Add people
								</DropdownMenuItem>
								<DropdownMenuItem>
									<ImageIcon className="mr-2 h-4 w-4" />
									Set space background
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Space settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive focus:text-destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete space
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<Share2 className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Share</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<Zap className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Automation</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<Fullscreen className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Fullscreen</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-1 px-6">
				{tabs.map((tab) => {
					const isActive = pathname === tab.href;
					const Icon = tab.icon;
					return (
						<Link
							key={tab.name}
							href={tab.href}
							className={cn(
								"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground",
							)}
						>
							<Icon className="h-4 w-4" />
							{tab.name}
						</Link>
					);
				})}
				<Button variant="ghost" size="icon" className="cursor-pointer">
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
