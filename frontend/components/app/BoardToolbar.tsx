"use client";

import {
	ChartLine,
	MoreHorizontal,
	Search,
	Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function BoardToolbar() {
	return (
		<div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
			<div className="flex items-center gap-3">
				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search board"
						className="h-9 w-48 bg-muted pl-9 focus-visible:ring-primary"
					/>
				</div>

				<div className="flex -space-x-2">
					<Avatar className="h-10 w-10 cursor-pointer hover:opacity-70 border-2 border-background transition">
						<AvatarFallback>U1</AvatarFallback>
					</Avatar>
					<Avatar className="h-10 w-10 cursor-pointer hover:opacity-70 border-2 border-background transition">
						<AvatarFallback>U2</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="gap-2 cursor-pointer">
							Group
							<span className="text-xs">▼</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>Status</DropdownMenuItem>
						<DropdownMenuItem>Assignee</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className=" cursor-pointer">
							<ChartLine className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Board Insights</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Settings2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>View settings</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>More options</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
