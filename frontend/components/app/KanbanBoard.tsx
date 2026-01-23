"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanHeader } from "@/components/app";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { IBoardResponse } from "@/types/project.interface";

interface KanbanBoardProps {
	boards?: IBoardResponse[];
	isLoading?: boolean;
}

export function KanbanBoard({ boards = [], isLoading = false }: KanbanBoardProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [boardOrder, setBoardOrder] = useState<IBoardResponse[]>([]);

	useEffect(() => {
		if (!boards.length) {
			setBoardOrder([]);
			return;
		}
		const sortedBoards = [...boards].sort(
			(a, b) => (a.position ?? 0) - (b.position ?? 0),
		);
		setBoardOrder(sortedBoards);
	}, [boards]);

	const boardIds = useMemo(() => boardOrder.map((board) => board.id), [boardOrder]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const getContainer = (id: string) => {
		if (boardIds.includes(id)) {
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
			const activeIndex = boardOrder.findIndex((board) => board.id === activeId);
			const overIndex = boardOrder.findIndex((board) => board.id === overId);
			if (activeIndex !== overIndex) {
				setBoardOrder(arrayMove(boardOrder, activeIndex, overIndex));
			}
			return;
		}

		if (overContainer === "boards") {
			return;
		}
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
					items={boardIds}
					strategy={horizontalListSortingStrategy}
				>
					<div className="flex gap-2 overflow-x-auto p-4 h-full">
						{isLoading ? (
							<div className="text-sm text-muted-foreground">Loading boards...</div>
						) : boardOrder.length ? (
							boardOrder.map((board) => (
								<SortableColumn key={board.id} id={board.id}>
									<KanbanHeader
										title={board.name}
										color={board.color}
										taskCount={0}
									/>

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
							))
						) : (
							<div className="text-sm text-muted-foreground">
								No boards found for this workspace.
							</div>
						)}
					</div>
				</SortableContext>
				<DragOverlay
					dropAnimation={{ duration: 200, easing: "ease-out" }}
				>
					{activeId && boardIds.includes(activeId) ? (
						<div className="min-w-70 max-w-80 rounded-md shadow-xl bg-background">
							<KanbanHeader
								title={
									boardOrder.find((board) => board.id === activeId)?.name ||
									"Board"
								}
								color={
									boardOrder.find((board) => board.id === activeId)?.color
								}
								taskCount={0}
							/>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
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
