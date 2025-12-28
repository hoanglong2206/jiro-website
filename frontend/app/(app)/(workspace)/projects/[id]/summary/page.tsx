"use client";

import { useParams } from "next/navigation";
import {
	CheckSquare,
	Calendar,
	Zap,
	CopyCheck,
	SquarePen,
	MoveDiagonal,
} from "lucide-react";
import { tasks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SummaryPage() {
	const { id } = useParams<{ id: string }>();
	const projectTasks = tasks.filter((task) => task.projectId === id);

	const todoCount = projectTasks.filter((t) => t.status === "todo").length;
	const inProgressCount = projectTasks.filter(
		(t) => t.status === "in-progress",
	).length;
	const inReviewCount = projectTasks.filter(
		(t) => t.status === "in-review",
	).length;
	const doneCount = projectTasks.filter((t) => t.status === "done").length;
	const totalCount = projectTasks.length;

	// Types of work calculations
	const taskCount = projectTasks.filter((t) => t.type === "task").length;
	const epicCount = projectTasks.filter((t) => t.type === "epic").length;
	const subtaskCount = projectTasks.filter((t) => t.type === "story").length;

	const taskPercentage =
		totalCount > 0 ? Math.round((taskCount / totalCount) * 100) : 0;
	const epicPercentage =
		totalCount > 0 ? Math.round((epicCount / totalCount) * 100) : 0;

	const unassignedCount = projectTasks.filter((t) => !t.assignee).length;
	// Due soon - tasks due in next 7 days
	const now = new Date();
	const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
	const dueSoonCount = projectTasks.filter((t) => {
		if (!t.dueDate) return false;
		const dueDate = new Date(t.dueDate);
		return dueDate >= now && dueDate <= next7Days;
	}).length;

	return (
		<div className="p-6 min-h-full">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
				<div className="rounded-lg p-4 border">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-500/20">
							<CheckSquare className="h-5 w-5 text-blue-500/80" />
						</div>
						<div>
							<div className="text-[16px] font-medium ">
								{doneCount} completed
							</div>
							<div className="text-sm text-muted-foreground">
								in the last 7 days
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg p-4 border">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-yellow-500/20">
							<SquarePen className="h-5 w-5 text-yellow-500/80" />
						</div>
						<div>
							<div className="text-[16px] font-medium ">
								{inProgressCount + inReviewCount} updated
							</div>
							<div className="text-sm text-muted-foreground">
								in the last 7 days
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg p-4 border">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-orange-500/20">
							<CopyCheck className="h-5 w-5 text-orange-500/80" />
						</div>
						<div>
							<div className="text-[16px] font-medium ">
								{todoCount} created
							</div>
							<div className="text-sm text-muted-foreground">
								in the last 7 days
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg p-4 border">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-purple-500/20">
							<Calendar className="h-5 w-5 text-purple-500/80" />
						</div>
						<div>
							<div className="text-[16px] font-medium ">
								{dueSoonCount} due soon
							</div>
							<div className="text-sm text-muted-foreground">
								in the next 7 days
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-4 mb-6">
				<div className="rounded-lg p-5 border">
					<div className="flex items-center justify-between mb-1">
						<h3 className=" font-semibold">Status overview</h3>
					</div>
					<p className="text-sm mb-4">
						Get a snapshot of the status of your work items.{" "}
						<span className="text-blue-400 cursor-pointer hover:underline">
							View all work items
						</span>
					</p>

					<div className="flex items-center justify-center gap-20">
						<div className="relative">Chart</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-sm bg-blue-500" />
								<span className="text-sm text-muted-foreground font-medium">
									Done: {doneCount}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-sm bg-green-500" />
								<span className="text-sm text-muted-foreground font-medium">
									In Progress: {inProgressCount}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-sm bg-purple-500" />
								<span className="text-sm text-muted-foreground font-medium">
									In Review: {inReviewCount}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-sm bg-amber-500" />
								<span className="text-sm text-muted-foreground font-medium">
									To Do: {todoCount}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg p-5 border">
					<div className="flex items-center justify-between mb-1">
						<div>
							<h3 className=" font-semibold">Recent activity</h3>
							<p className="text-sm mb-4">
								Stay up to date with what&apos;s happening across the space
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="cursor-pointer border"
						>
							<MoveDiagonal className="h-4 w-4" />
						</Button>
					</div>
					<div className="mb-4 flex flex-col items-center justify-center">
						<svg width="120" height="100" viewBox="0 0 120 100" fill="none">
							<rect
								x="30"
								y="20"
								width="60"
								height="50"
								rx="4"
								fill="#3d3d5c"
							/>
							<rect x="35" y="30" width="20" height="3" rx="1" fill="#22c55e" />
							<rect x="35" y="36" width="30" height="3" rx="1" fill="#3b82f6" />
							<rect x="35" y="42" width="25" height="3" rx="1" fill="#60a5fa" />
							<rect x="35" y="48" width="35" height="3" rx="1" fill="#a855f7" />
							<circle cx="85" cy="25" r="8" fill="#22c55e" />
							<path
								d="M82 25l2 2 4-4"
								stroke="white"
								strokeWidth="2"
								fill="none"
							/>
							<circle cx="95" cy="55" r="6" fill="#60a5fa" />
							<circle cx="20" cy="70" r="10" fill="#f59e0b" />
							<circle cx="100" cy="80" r="8" fill="#ec4899" />
						</svg>
					</div>
					<h4 className="text-center font-medium mb-2">No activity yet</h4>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-4 mb-6">
				<div className="rounded-lg p-5 border">
					<h3 className=" font-semibold mb-1">Types of work</h3>
					<p className="text-sm mb-4">
						Get a breakdown of work items by their types.{" "}
						<span className="text-blue-400 cursor-pointer hover:underline">
							View all items
						</span>
					</p>

					<div className="space-y-4">
						<div className="grid grid-cols-[100px_1fr_80px] items-center gap-4 text-sm">
							<span className="">Type</span>
							<span className="">Distribution</span>
						</div>

						<div className="grid grid-cols-[100px_1fr_80px] items-center gap-4">
							<div className="flex items-center gap-2">
								<CheckSquare className="h-4 w-4 text-blue-400" />
								<span className="">Task</span>
							</div>
							<div className="h-6  rounded overflow-hidden">
								<div
									className="h-full bg-blue-500 rounded"
									style={{ width: `${taskPercentage}%` }}
								/>
							</div>
							<span className="">{taskPercentage}%</span>
						</div>

						<div className="grid grid-cols-[100px_1fr_80px] items-center gap-4">
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-purple-400" />
								<span className="">Epic</span>
							</div>
							<div className="h-6 rounded overflow-hidden">
								<div
									className="h-full bg-purple-500 rounded"
									style={{ width: `${epicPercentage}%` }}
								/>
							</div>
							<span className="">{epicPercentage}%</span>
						</div>

						<div className="grid grid-cols-[100px_1fr_80px] items-center gap-4">
							<div className="flex items-center gap-2">
								<svg
									className="h-4 w-4 text-cyan-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<path d="M9 3v18M3 9h18" />
								</svg>
								<span className="">Subtask</span>
							</div>
							<div className="h-6  rounded overflow-hidden">
								<div
									className="h-full bg-cyan-500 rounded"
									style={{
										width: `${
											totalCount > 0
												? Math.round((subtaskCount / totalCount) * 100)
												: 0
										}%`,
									}}
								/>
							</div>
							<span className="">
								{totalCount > 0
									? Math.round((subtaskCount / totalCount) * 100)
									: 0}
								%
							</span>
						</div>
					</div>
				</div>
				<div className="rounded-lg p-5 border">
					<h3 className=" font-semibold mb-1">Team workload</h3>
					<p className="text-sm mb-4">
						Monitor the capacity of your team.{" "}
						<span className="text-blue-400 cursor-pointer hover:underline">
							Reassign work items to get the right balance
						</span>
					</p>

					<div className="space-y-3">
						<div className="grid grid-cols-[120px_1fr] items-center gap-4 text-sm">
							<span>Assignee</span>
							<span>Work distribution</span>
						</div>

						<div className="grid grid-cols-[120px_1fr] items-center gap-4">
							<div className="flex items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarFallback className="bg-gray-400 text-xs">
										?
									</AvatarFallback>
								</Avatar>
								<span className="text-sm text-gray-300">Unassigned</span>
							</div>
							<div className="h-6 bg-gray-400 rounded flex items-center px-2">
								<span className="text-xs ">
									{totalCount > 0
										? Math.round((unassignedCount / totalCount) * 100)
										: 0}
									%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
