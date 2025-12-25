import { BoardToolbar, KanbanBoard } from "@/components/app";
import { tasks } from "@/lib/data";

export default async function BoardPage() {
	return (
		<div className="flex h-full flex-col">
			<BoardToolbar />
			<KanbanBoard tasks={tasks} />
		</div>
	);
}
