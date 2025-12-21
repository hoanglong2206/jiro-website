"use client";

import { MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function CalendarPage() {
	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search list"
							className="h-9 w-48 bg-muted pl-9 focus-visible:ring-primary"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-3">
						<Button variant="outline" className="cursor-pointer">
							Today
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="gap-2 bg-transparent cursor-pointer"
								>
									<span>Month</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Month</DropdownMenuItem>
								<DropdownMenuItem>Week</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<Button variant="ghost" size="icon" className="cursor-pointer">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
