import { Task } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Book,
	MoreHorizontal,
	SquareCheck,
	Zap,
	TriangleAlert,
	Calendar,
	Clock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";
import { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface KanbanCardProps {
	task: Task;
}

const iconTask: Record<string, ReactNode> = {
	task: <SquareCheck className="size-4 text-primary" />,
	epic: <Zap className="size-4 text-purple-400" />,
	story: <Book className="size-4 text-green-400" />,
};

const iconDueStatus: Record<string, ReactNode> = {
	overdue: <TriangleAlert className="size-4 text-rose-600" />,
	"due-today": <Calendar className="size-4 text-amber-600" />,
	upcoming: <Clock className="size-4 text-emerald-600" />,
	"no-due": <></>,
};

export const KanbanCard = ({ task }: KanbanCardProps) => {
	const icon = iconTask[task.type];
	const dueDate = task.dueDate ? new Date(task.dueDate) : null;
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

	return (
		<div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-1">
			<div className="flex items-start justify-between gap-x-2">
				<p className="text-sm line-clamp-2">{task.title}</p>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-neutral-200/40 size-7 cursor-pointer"
							onClick={(event) => event.stopPropagation()}
						>
							<MoreHorizontal className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>More actions</p>
					</TooltipContent>
				</Tooltip>
			</div>
			<div
				className={cn(
					"px-1 py-0.5 border-2 flex items-center justify-start text-xs rounded max-w-2/5 font-medium",
					dueStatus === "overdue" && "bg-rose-50 border-rose-200 text-rose-700",
					dueStatus === "due-today" &&
						"bg-amber-50 border-amber-200 text-amber-700",
					dueStatus === "upcoming" &&
						"bg-emerald-50 border-emerald-200 text-emerald-700",
					dueStatus === "no-due" &&
						"bg-neutral-100 border-neutral-200 text-neutral-600",
				)}
			>
				{iconDue}
				<span className="ml-1">
					{dueStatus === "no-due" ? "No due date" : formatDate(task.dueDate!)}
				</span>
			</div>
			<Separator />
			<div className="flex items-center justify-between text-xs text-neutral-500 px-2">
				<div className="flex items-center gap-x-1">
					{icon}
					<span className="capitalize">{task.key}</span>
				</div>
				<Avatar className="size-8 cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all">
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
	);
};
