"use client";

import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { projects, tasks, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SpaceFilter = "recommended" | "recent";

interface Activity {
	id: string;
	task: (typeof tasks)[0];
	action: "commented" | "created" | "updated" | "viewed";
	user: (typeof users)[0];
	timestamp: string;
}

const activities: Activity[] = [
	{
		id: "1",
		task: tasks[0],
		action: "commented",
		user: users[0],
		timestamp: "2 hours ago",
	},
	{
		id: "2",
		task: tasks[1],
		action: "created",
		user: users[0],
		timestamp: "1 day ago",
	},
	{
		id: "3",
		task: tasks[2],
		action: "created",
		user: users[0],
		timestamp: "2 days ago",
	},
	{
		id: "4",
		task: tasks[3],
		action: "updated",
		user: users[0],
		timestamp: "3 days ago",
	},
	{
		id: "5",
		task: tasks[4],
		action: "created",
		user: users[0],
		timestamp: "5 days ago",
	},
];

const getActionLabel = (action: string) => {
	switch (action) {
		case "commented":
			return "Commented on";
		case "created":
			return "Created";
		case "updated":
			return "Updated";
		case "viewed":
			return "Viewed";
		default:
			return action;
	}
};

export default function ForYouPage() {
	const [spaceFilter, setSpaceFilter] = useState<SpaceFilter>("recommended");

	const getOpenWorkItems = (projectId: string) => {
		return tasks.filter((t) => t.projectId === projectId && t.status !== "done")
			.length;
	};

	return (
		<div className="flex-1 overflow-auto bg-background">
			<div className="max-w-6xl mx-auto p-4 md:p-8">
				<h1 className="text-2xl font-semibold text-foreground">For you</h1>
				<hr className="my-4" />

				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-medium text-foreground">
							{spaceFilter === "recommended"
								? "Recommended spaces"
								: "Recent spaces"}
						</h2>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setSpaceFilter("recommended")}
								className={cn(
									"px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer",
									spaceFilter === "recommended"
										? "border-primary text-primary hover:bg-primary/10"
										: "border-transparent hover:bg-muted",
								)}
							>
								Recommended
							</button>
							<button
								onClick={() => setSpaceFilter("recent")}
								className={cn(
									"px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer",
									spaceFilter === "recent"
										? "border-primary text-primary hover:bg-primary/10"
										: "border-transparent hover:bg-muted",
								)}
							>
								Recent
							</button>
							<Link
								href="/spaces"
								className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
							>
								View all spaces
							</Link>
						</div>
					</div>
					<div className="flex gap-4 overflow-auto">
						{spaceFilter === "recommended" ? (
							<>
								{projects.slice(0, 3).map((project) => (
									<div
										key={project.id}
										className="shrink-0 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card flex flex-col justify-between cursor-pointer"
									>
										<div className="space-y-0.5">
											<h3 className="font-medium text-foreground truncate">
												{project.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												Software project
											</p>
										</div>
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
											<Users className="h-3.5 w-3.5" />
											<span>Popular with teammates</span>
										</div>
									</div>
								))}
							</>
						) : (
							<>
								{projects.slice(0, 2).map((project) => (
									<div
										key={project.id}
										className="shrink-0 w-64 rounded-sm flex flex-col justify-between border-l-20 border-l-primary py-1 space-y-1 shadow-md"
									>
										<div className="flex items-start gap-3 px-4">
											<div className="min-w-0">
												<h3 className="font-medium truncate">
													{project.name === "Billing System Dev"
														? "(Example) Billing System..."
														: project.name}
												</h3>
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
													{getOpenWorkItems(project.id)}
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
								))}
							</>
						)}
					</div>
					<div className="flex w-full items-center justify-end">
						<div className="text-sm text-primary hover:underline mt-2 inline-block md:hidden">
							View all spaces
						</div>
					</div>
				</div>

				<Tabs defaultValue="worked-on" className="space-y-6">
					<TabsList>
						<TabsTrigger value="worked-on">Worked on</TabsTrigger>
						<TabsTrigger value="viewed">Viewed</TabsTrigger>
						<TabsTrigger value="starred">Starred</TabsTrigger>
					</TabsList>
					<TabsContent value="worked-on">
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
							In the last week
						</h3>
						<div className="space-y-1">
							{activities.map((activity) => {
								const project = projects.find(
									(p) => p.id === activity.task.projectId,
								);
								return (
									<div
										key={activity.id}
										className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
									>
										<div className="flex items-center gap-3 max-w-[220px] lg:w-auto">
											<div>
												<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
													{activity.task.title}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{activity.task.key} · (Example) {project?.name}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<span className="text-xs lg:text-sm text-muted-foreground truncate">
												{getActionLabel(activity.action)}
											</span>
											<Avatar className="h-8 w-8 bg-orange-500">
												<AvatarFallback className="bg-orange-500 text-white text-xs">
													{activity.user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
										</div>
									</div>
								);
							})}
						</div>
					</TabsContent>
					<TabsContent value="viewed">
						<p className="text-sm text-muted-foreground">
							No recently viewed work items.
						</p>
					</TabsContent>
					<TabsContent value="starred">
						<p className="text-sm text-muted-foreground">
							You haven&apos;t starred any work items yet.
						</p>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
