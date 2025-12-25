import { Task } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface KanbanCardProps {
	task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
	return (
		<div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-1">
			<div className="flex items-start justify-between gap-x-2">
				<p className="text-sm line-clamp-2">{task.title}</p>
				<Button variant="ghost" size="icon" className="hover:bg-neutral-200">
					<MoreHorizontal className="size-4" />
				</Button>
			</div>
			<Separator />
			<div className="flex items-center justify-between text-xs text-neutral-500">
				{task.dueDate && (
					<p>
						Due:{" "}
						<span className="font-medium">
							{new Date(task.dueDate).toLocaleDateString()}
						</span>
					</p>
				)}
				<div className="flex items-center gap-x-1">
					<Avatar className="size-5">
						<AvatarImage
							src={task.assignee?.avatar || "/logo.svg"}
							alt={task.assignee?.name || "Unassigned"}
						/>
						<AvatarFallback>
							{task.assignee?.name
								? task.assignee.name.charAt(0).toUpperCase()
								: "U"}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
		</div>
	);
};
