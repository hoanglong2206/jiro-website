"use client";

import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForYouPage() {
	const [projects, setProjects] = useState<any[]>([]);
	const [notifications, setNotifications] = useState<any[]>([]);

	return (
		<div className="overflow-auto bg-background">
			<div className="mx-auto p-4 md:px-16">
				<h1 className="text-2xl font-semibold text-foreground">
					For you
				</h1>
				<hr className="my-4" />

				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-medium text-foreground">
							Projects
						</h2>
						<div className="flex items-center gap-2">
							<Link
								href="/projects"
								className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
							>
								View all projects
							</Link>
						</div>
					</div>
					{projects.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-3">
							<h2 className="text-lg font-medium text-foreground">
								No projects found
							</h2>
							<span className="text-sm text-muted-foreground italic">
								You have no recently viewed projects.
							</span>
							<button className="px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer border-primary text-primary hover:bg-primary/10">
								Create new project
							</button>
						</div>
					) : (
						<div className="flex gap-4 overflow-auto py-1"></div>
					)}
				</div>
				<div className="space-y-1 mt-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-medium text-foreground">
							Notification
						</h2>
						<div className="flex items-center gap-2">
							<Link
								href="/notifications"
								className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
							>
								View all notifications
							</Link>
						</div>
					</div>
					{notifications.length === 0 ? (
						<h2 className="text-lg font-medium text-foreground text-center">
							You no have any notifications
						</h2>
					) : (
						<div className="flex gap-4 overflow-auto py-1"></div>
					)}
				</div>
			</div>
		</div>
	);
}

const projectCard = ({ project }: { project?: any }) => {
	return (
		<div className="shrink-0 w-64 rounded-sm flex flex-col justify-between border-l-20 border-l-primary py-1 space-y-1 shadow-md">
			<div className="flex items-start gap-3 px-4">
				<div className="min-w-0">
					<h3 className="font-medium truncate">Billing System Dev</h3>
					<p className="text-sm text-muted-foreground">
						Team-managed software
					</p>
				</div>
			</div>

			<div className="px-4">
				<p className="text-xs font-medium text-muted-foreground">
					Quick links
				</p>
				<div className="flex items-center justify-between text-xs  transition-colors">
					<span>My open work items</span>
					<Badge variant="secondary" className="bg-primary/20">
						8
					</Badge>
				</div>
				<div className="flex items-center text-xs transition-colors">
					<span>Done work items</span>
				</div>
			</div>

			<div className="border-t border-border px-4 flex items-center justify-between pt-0.5">
				<button className="flex items-center py-0.5 px-2 gap-1 text-xs transition-colors hover:bg-muted/90 cursor-pointer">
					<span>1 board</span>
					<ChevronDown className="h-3 w-3" />
				</button>
			</div>
		</div>
	);
};
