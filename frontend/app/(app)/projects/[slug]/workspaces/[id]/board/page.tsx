import { KanbanBoard, BoardToolbar } from "@/components/app";
import { tasks } from "@/lib/data";

export default async function BoardPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const projectTasks = tasks.filter((task) => task.projectId === id);

	return (
		<div className="flex h-full flex-col">
			<BoardToolbar />
			<KanbanBoard tasks={projectTasks} />
		</div>
	);
}
