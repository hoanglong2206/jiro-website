"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/data";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "@hello-pangea/dnd";
import { KanbanHeader, KanbanCard } from "@/components/app";

interface KanbanBoardProps {
	tasks: Task[];
}

const boards: TaskStatus[] = [
	TaskStatus.TODO,
	TaskStatus.IN_PROGRESS,
	TaskStatus.IN_REVIEW,
	TaskStatus.DONE,
];

type TaskState = {
	[Key in TaskStatus]: Task[];
};

export function KanbanBoard({ tasks }: KanbanBoardProps) {
	const [taskState, setTaskState] = useState<TaskState>(() => {
		const initialState: TaskState = {
			[TaskStatus.TODO]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.IN_REVIEW]: [],
			[TaskStatus.DONE]: [],
		};
		tasks.forEach((task) => {
			switch (task.status) {
				case "todo":
					initialState[TaskStatus.TODO].push(task);
					break;
				case "in-progress":
					initialState[TaskStatus.IN_PROGRESS].push(task);
					break;
				case "in-review":
					initialState[TaskStatus.IN_REVIEW].push(task);
					break;
				case "done":
					initialState[TaskStatus.DONE].push(task);
					break;
			}
		});
		return initialState;
	});

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) return;
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		)
			return;
		const sourceBoard = source.droppableId as TaskStatus;
		const destBoard = destination.droppableId as TaskStatus;
		const sourceTasks = Array.from(taskState[sourceBoard]);
		const [movedTask] = sourceTasks.splice(source.index, 1);
		const destTasks =
			sourceBoard === destBoard
				? sourceTasks
				: Array.from(taskState[destBoard]);
		destTasks.splice(destination.index, 0, movedTask);
		setTaskState((prev) => ({
			...prev,
			[sourceBoard]: sourceTasks,
			[destBoard]: destTasks,
		}));
	};
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="flex gap-2 overflow-x-auto p-4">
				{boards.map((board) => {
					return (
						<div key={board} className="flex-1 bg-muted p-1.5 rounded-md">
							<KanbanHeader board={board} taskCount={taskState[board].length} />
							<Droppable droppableId={board}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="min-h-[200px] py-1.5"
									>
										{taskState[board].map((task, index) => (
											<Draggable
												key={task.id}
												draggableId={task.id}
												index={index}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<KanbanCard task={task} />
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
}
