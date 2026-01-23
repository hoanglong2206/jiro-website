"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/data";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	DragOverlay,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanHeader, KanbanCard } from "@/components/app";
import { TaskModal } from "./TaskModal";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
	tasks: Task[];
}

const initialBoards: TaskStatus[] = [
	TaskStatus.TODO,
	TaskStatus.IN_PROGRESS,
	TaskStatus.IN_REVIEW,
	TaskStatus.DONE,
];

type TaskState = {
	[Key in TaskStatus]: Task[];
};

export function KanbanBoard({ tasks }: KanbanBoardProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [boardOrder, setBoardOrder] = useState<TaskStatus[]>(initialBoards);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const getContainer = (id: string) => {
		if (boardOrder.includes(id as TaskStatus)) {
			return "boards";
		}

		return null;
	};

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const activeContainer = getContainer(activeId);
		const overContainer = getContainer(overId);

		if (!activeContainer || !overContainer) return;

		if (activeContainer === "boards" && overContainer !== "boards") {
			return;
		}

		if (activeContainer === "boards" && overContainer === "boards") {
			const activeIndex = boardOrder.indexOf(activeId as TaskStatus);
			const overIndex = boardOrder.indexOf(overId as TaskStatus);
			if (activeIndex !== overIndex) {
				setBoardOrder(arrayMove(boardOrder, activeIndex, overIndex));
			}
			return;
		}

		if (overContainer === "boards") {
			return;
		}
	};

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleCardClick = (task: Task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={(e) => {
					handleDragEnd(e);
					setActiveId(null);
				}}
				onDragStart={(e) => {
					setActiveId(e.active.id as string);
				}}
				onDragCancel={() => setActiveId(null)}
			>
				<SortableContext
					items={boardOrder}
					strategy={horizontalListSortingStrategy}
				>
					<div className="flex gap-2 overflow-x-auto p-4 h-full">
						{boardOrder.map((board) => (
							<SortableColumn key={board} id={board}>
								<KanbanHeader board={board} taskCount={0} />

								<div className="max-h-145 p-1.5 overflow-auto bg-sidebar no-scrollbar rounded-b-md shadow-xs">
									<Button
										variant="ghost"
										className="w-full justify-start cursor-pointer gap-1"
									>
										<Plus className="size-4" />
										Add task
									</Button>
								</div>
							</SortableColumn>
						))}
					</div>
				</SortableContext>
				<DragOverlay
					dropAnimation={{ duration: 200, easing: "ease-out" }}
				>
					{activeId && boardOrder.includes(activeId as TaskStatus) ? (
						<div className="min-w-70 max-w-80 rounded-md shadow-xl bg-background">
							<KanbanHeader
								board={activeId as TaskStatus}
								taskCount={0}
							/>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
			<TaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				task={selectedTask}
			/>
		</>
	);
}

function SortableColumn({ id, children }: { id: string; children: ReactNode }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
		scale: isDragging ? 1.03 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className={`flex-1 min-w-70 max-w-80 rounded-md transition-shadow ${
				isDragging ? "shadow-xs z-50" : ""
			}`}
		>
			<div {...listeners}>{children}</div>
		</div>
	);
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
}
