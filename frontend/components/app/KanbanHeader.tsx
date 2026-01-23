'use client";';

import { TaskStatus } from "@/lib/data";
import {
	CheckCheck,
	CircleDashedIcon,
	MoreHorizontal,
	Pen,
	Target,
	Trash2,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanHeaderProps {
	board: TaskStatus;
	taskCount: number;
}

const statusLabels: Record<TaskStatus, ReactNode> = {
	[TaskStatus.TODO]: <CircleDashedIcon className="size-4 text-red-400" />,
	[TaskStatus.IN_PROGRESS]: (
		<CircleDashedIcon className="size-4 text-yellow-400" />
	),
	[TaskStatus.IN_REVIEW]: (
		<CircleDashedIcon className="size-4 text-blue-400" />
	),
	[TaskStatus.DONE]: <CircleDashedIcon className="size-4 text-green-400" />,
};
export const KanbanHeader = ({ board, taskCount }: KanbanHeaderProps) => {
	const icon = statusLabels[board];
	return (
		<div className="px-3 py-2 flex items-center justify-between bg-sidebar rounded-md">
			<div className="flex items-center gap-x-2">
				{icon}
				<h2 className="text-sm font-medium capitalize">
					{board.replace(/_/g, " ").toLowerCase()}
				</h2>
				<div className="size-5 flex items-center justify-center rounded-full text-xs bg-neutral-200 text-neutral-800 font-medium">
					{taskCount}
				</div>
			</div>
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="cursor-pointer size-7"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>More actions</p>
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent align="start" className="w-40">
					<DropdownMenuItem>
						<Pen className="h-4 w-4" />
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CheckCheck className="h-4 w-4" />
						Select all
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						<Target className="h-4 w-4" />
						Edit status
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive focus:text-destructive">
						<Trash2 className="h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
