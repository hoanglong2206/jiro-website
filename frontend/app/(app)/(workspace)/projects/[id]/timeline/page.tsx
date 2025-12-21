"use client";

import { Search, Settings2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TimelinePage() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search timeline"
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

			<div className="flex flex-1 overflow-hidden"></div>
		</div>
	);
}
