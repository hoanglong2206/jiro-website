"use client";

import { CustomModal } from "@/components/ui/modal";
import { Task } from "@/lib/data";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Calendar,
	Eye,
	GitBranch,
	LockOpen,
	MoreHorizontal,
	Plus,
	Settings,
	TriangleAlert,
	Clock,
	User,
	Sparkles,
	Paperclip,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { cn, formatDate } from "@/lib/utils";

interface TaskModalProps {
	open: boolean;
	onClose: () => void;
	task: Task | null;
}

const colorTaskStatus: Record<string, string> = {
	todo: "bg-red-100 text-red-600",
	"in-progress": "bg-yellow-100 text-yellow-600",
	"in-review": "bg-blue-100 text-blue-600",
	done: "bg-green-100 text-green-600",
};

const iconDueStatus: Record<string, ReactNode> = {
	overdue: <TriangleAlert className="size-5 text-rose-600" />,
	"due-today": <Calendar className="size-5 text-amber-600" />,
	upcoming: <Clock className="size-5 text-emerald-600" />,
};

export const TaskModal = ({ open, onClose, task }: TaskModalProps) => {
	const [comment, setComment] = useState("");
	const dueDate = task?.dueDate ? new Date(task.dueDate) : null;
	const today = new Date();
	const normalize = (date: Date) =>
		new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const dueDiff = dueDate
		? normalize(dueDate).getTime() - normalize(today).getTime()
		: null;
	const dueStatus =
		dueDiff === null
			? "no-due"
			: dueDiff < 0
			? "overdue"
			: dueDiff === 0
			? "due-today"
			: "upcoming";
	const iconDue = iconDueStatus[dueStatus];

	const formatDescription = (desc: string) => {
		return desc.split("\n").map((line, i) => {
			if (line.startsWith("•")) {
				return (
					<li key={i} className="ml-4">
						{line.substring(1).trim()}
					</li>
				);
			}
			return (
				<p key={i} className={line === "" ? "h-4" : ""}>
					{line}
				</p>
			);
		});
	};
	return (
		<CustomModal size="xl:min-w-7xl" open={open} onClose={onClose}>
			<div className="flex h-full flex-col gap-8">
				<div className="flex items-center justify-start gap-x-2 w-full">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className={`px-4 py-0.5 cursor-pointer min-w-20 capitalize ${
									colorTaskStatus[task?.status || ""]
								}`}
								variant={"secondary"}
							>
								{task?.status?.replace(/-/g, " ")}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="z-9999">
							<DropdownMenuItem className="cursor-pointer">
								<Badge variant="secondary" className="bg-red-100 text-red-600">
									Todo
								</Badge>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Badge
									variant="secondary"
									className="bg-yellow-100 text-yellow-600"
								>
									In Progress
								</Badge>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Badge
									variant="secondary"
									className="bg-blue-100 text-blue-600"
								>
									In Review
								</Badge>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-600"
								>
									Done
								</Badge>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<LockOpen className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="z-9999">
							<p>No restrictions</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<Eye className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="z-9999">
							<p>View options</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<MoreHorizontal className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="z-9999">
							<p>Actions</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex flex-1 flex-col gap-4 md:flex-row lg:overflow-hidden">
					{/* 1 */}
					<div className="flex flex-1 flex-col gap-y-3 lg:max-h-full lg:overflow-y-auto">
						<h1 className="text-xl font-semibold">{task?.title}</h1>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 bg-transparent"
							>
								<Plus className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 bg-transparent"
							>
								<Settings className="h-4 w-4" />
							</Button>
						</div>
						<div className="space-y-2 px-1">
							<h3 className="text-lg font-semibold">Description</h3>
							<div className="text-sm text-muted-foreground leading-relaxed">
								{task?.description ? (
									<div className="space-y-1">
										{formatDescription(task?.description)}
									</div>
								) : (
									<p className="italic">No description</p>
								)}
							</div>
						</div>

						<div className="space-y-2 px-1">
							<h3 className="text-lg font-semibold">Subtasks</h3>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground cursor-pointer"
							>
								<Plus className="h-4 w-4" />
								Add subtask
							</Button>
						</div>

						<div className="space-y-2 px-1">
							<h3 className="text-lg font-semibold">Activities</h3>
							<Tabs defaultValue="comments" className="w-full">
								<TabsList className="border-b border-border mb-4">
									<TabsTrigger value="comments">Comments</TabsTrigger>
									<TabsTrigger value="activity">Activity</TabsTrigger>
								</TabsList>
								<TabsContent value="comments">
									<div className="space-y-4">
										{!task?.comments?.length && (
											<p className="text-sm text-muted-foreground">
												No comments yet.
											</p>
										)}
										{task?.comments?.map((c) => (
											<div key={c.id} className="flex items-start gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={c.user.avatar || "/placeholder.svg"}
													/>
													<AvatarFallback className="text-xs">
														{c.user.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm">
														<strong>{c.user.name}</strong> {c.content}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(c.createdAt).toLocaleString()}
													</p>
												</div>
											</div>
										))}
										<div className="mt-4">
											<Textarea
												placeholder="Add a comment..."
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
											<Button
												className="mt-2"
												onClick={() => {
													setComment("");
												}}
											>
												Add Comment
											</Button>
										</div>
									</div>
								</TabsContent>
								<TabsContent value="activity">
									<p className="text-sm text-muted-foreground">
										No recent activity.
									</p>
								</TabsContent>
							</Tabs>
						</div>
					</div>
					{/* 2 */}
					<div className="w-[350px] xl:w-100 shrink-0 space-y-4 lg:overflow-y-auto">
						<div className="border border-border bg-muted/30 p-4 rounded-md">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold italic">Details</h3>
								<div className="flex items-center gap-2 text-sm text-primary">
									<span>{task?.key}</span>
								</div>
							</div>
							<hr className="my-4 border-t border-border" />
							<div className="space-y-1">
								<div className="flex items-center justify-between py-1.5 px-2 gap-x-4">
									<div className="text-sm w-32 text-muted-foreground font-medium">
										Assigned to
									</div>
									<div className="space-y-1 flex-1">
										<div className="flex items-center justify-end gap-x-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition">
											{task?.assignee ? (
												<>
													<Avatar className="h-7 w-7">
														<AvatarImage
															src={task?.assignee?.avatar || "/placeholder.svg"}
														/>
														<AvatarFallback className="text-xs">
															{task?.assignee?.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm">
														{task?.assignee?.name}
													</span>
												</>
											) : (
												<>
													<div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
														<User className="h-5 w-5 text-muted-foreground" />
													</div>
													<span className="text-sm">Unassigned</span>
												</>
											)}
										</div>
										<div className="flex items-center justify-end ">
											<span className="text-sm text-blue-500 hover:underline cursor-pointer">
												Assign to me
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between py-1.5 px-2 gap-x-4">
									<div className="text-sm w-32 text-muted-foreground font-medium">
										Due date
									</div>
									<div className="flex flex-1 items-center justify-end gap-x-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition">
										{dueDate ? (
											<div
												className={cn(
													"px-1 py-0.5 border-2 flex items-center justify-start text-xs rounded font-medium",
													dueStatus === "overdue" &&
														"bg-rose-50 border-rose-200 text-rose-700",
													dueStatus === "due-today" &&
														"bg-amber-50 border-amber-200 text-amber-700",
													dueStatus === "upcoming" &&
														"bg-emerald-50 border-emerald-200 text-emerald-700",
												)}
											>
												{iconDue}
												<span className="ml-1">{formatDate(dueDate!)}</span>
											</div>
										) : (
											<div className="h-7">
												<span className="text-sm text-muted-foreground">
													None
												</span>
											</div>
										)}
									</div>
								</div>
								<div className="flex items-center justify-between py-1.5 px-2 gap-x-4">
									<div className="text-sm w-32 text-muted-foreground font-medium">
										Start date
									</div>
									<div className="flex flex-1 items-center justify-end gap-x-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition h-10">
										{task?.startDate ? (
											<span className="text-sm">
												{formatDate(task.startDate)}
											</span>
										) : (
											<span className="text-sm text-muted-foreground">
												None
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center justify-between py-1.5 px-2 gap-x-4">
									<div className="text-sm w-32 text-muted-foreground font-medium">
										Team
									</div>
									<div className="flex flex-1 items-center justify-end gap-x-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition h-10">
										<span className="text-sm text-muted-foreground">None</span>
									</div>
								</div>
								<div className="flex items-center justify-between py-1.5 px-2 gap-x-4">
									<div className="text-sm w-32 text-muted-foreground font-medium">
										Development
									</div>
									<div className="flex flex-1 items-center justify-end gap-x-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition h-10">
										<button className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
											<GitBranch className="h-4 w-4" />
											Create branch
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-center gap-x-4 px-2">
							<Button
								variant="outline"
								className="cursor-pointer bg-transparent w-1/2"
							>
								<Sparkles className="h-4 w-4" />
								Improve Task
							</Button>
							<Button
								variant="outline"
								className="cursor-pointer bg-transparent w-1/2"
							>
								<Paperclip className="h-4 w-4" />
								Attachment
							</Button>
						</div>
						<div className="px-2 space-y-1 text-start">
							<p className="text-xs text-muted-foreground">
								Created on {task && formatDate(task.createdAt)}
							</p>
							<p className="text-xs text-muted-foreground">
								Last updated on {task && formatDate(task.updatedAt)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
