"use client";

import { cn } from "@/lib/utils";
import { UsersRound, Component, MoreHorizontal, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const TeamHeader = () => {
	const pathname = usePathname();
	console.log(pathname);
	const tabs = [
		{ name: "Teams", href: "teams", icon: Component },
		{ name: "People", href: "people", icon: UsersRound },
		{ name: "Analytics", href: "analytics", icon: Radio },
	];
	return (
		<div className="bg-card px-6 py-4">
			{/* Tabs */}
			<div className="flex items-center gap-1 border-b border-border">
				{tabs.map((tab) => {
					const isActive = pathname === tab.href;
					const Icon = tab.icon;
					return (
						<Link
							key={tab.name}
							href={`${tab.href}`}
							className={cn(
								"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
							)}
						>
							<Icon className="h-4 w-4" />
							{tab.name}
						</Link>
					);
				})}
			</div>
			<div className="flex items-center justify-between border-b border-border py-4">
				<div className="text-2xl font-semibold text-foreground">
					{tabs.filter((tab) => pathname.includes(tab.href))[0].name}
				</div>
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="cursor-pointer"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>More actions</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
