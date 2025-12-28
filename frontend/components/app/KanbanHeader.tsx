'use client";';

import { TaskStatus } from "@/lib/data";
import { CircleDashedIcon, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface KanbanHeaderProps {
	board: TaskStatus;
	taskCount: number;
}

const statusLabels: Record<TaskStatus, ReactNode> = {
	[TaskStatus.TODO]: <CircleDashedIcon className="size-4 text-red-400" />,
	[TaskStatus.IN_PROGRESS]: (
		<CircleDashedIcon className="size-4 text-yellow-400" />
	),
	[TaskStatus.IN_REVIEW]: <CircleDashedIcon className="size-4 text-blue-400" />,
	[TaskStatus.DONE]: <CircleDashedIcon className="size-4 text-green-400" />,
};
export const KanbanHeader = ({ board, taskCount }: KanbanHeaderProps) => {
	const icon = statusLabels[board];
	return (
		<div className="px-2 py-1 flex items-center justify-between">
			<div className="flex items-center gap-x-2">
				{icon}
				<h2 className="text-sm font-medium capitalize">
					{board.replace(/_/g, " ").toLowerCase()}
				</h2>
				<div className="size-5 flex items-center justify-center rounded-full text-xs bg-neutral-200 text-neutral-800 font-medium">
					{taskCount}
				</div>
			</div>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-neutral-200/40 size-7 cursor-pointer"
					>
						<MoreHorizontal className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>More actions</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};
