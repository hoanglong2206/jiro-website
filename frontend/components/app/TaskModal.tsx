import React from "react";
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

interface TaskModalProps {
	open: boolean;
	onClose: () => void;
	task: Task | null;
}

export const TaskModal = ({ open, onClose, task }: TaskModalProps) => {
	return (
		<CustomModal size="min-w-5xl" open={open} onClose={onClose}>
			<div className="flex items-center justify-start gap-x-2 w-full">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="px-4 py-0.5 cursor-pointer min-w-20 capitalize"
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
							<Badge variant="secondary" className="bg-blue-100 text-blue-600">
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
			</div>
		</CustomModal>
	);
};
