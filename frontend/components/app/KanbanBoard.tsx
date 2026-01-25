"use client";

import { useMemo, useState, type ReactNode, type HTMLAttributes } from "react";
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
import { KanbanHeader, InputWithColorPicker } from "@/components/app";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { IBoardResponse } from "@/types/project.interface";

interface KanbanBoardProps {
	boards?: IBoardResponse[];
	isLoading?: boolean;
}

export function KanbanBoard({
	boards = [],
	isLoading = false,
}: KanbanBoardProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [customOrderIds, setCustomOrderIds] = useState<string[] | null>(null);

	const sortedBoards = useMemo(() => {
		return [...boards].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
	}, [boards]);

	const orderedBoards = useMemo(() => {
		if (!customOrderIds) return sortedBoards;
		const map = new Map(sortedBoards.map((board) => [board.id, board]));
		const result: IBoardResponse[] = [];
		customOrderIds.forEach((id) => {
			const board = map.get(id);
			if (board) result.push(board);
		});
		sortedBoards.forEach((board) => {
			if (!customOrderIds.includes(board.id)) {
				result.push(board);
			}
		});
		return result;
	}, [sortedBoards, customOrderIds]);

	const boardIds = useMemo(
		() => orderedBoards.map((board) => board.id),
		[orderedBoards],
	);

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
			const activeIndex = boardIds.indexOf(activeId);
			const overIndex = boardIds.indexOf(overId);
			if (activeIndex !== overIndex) {
				const nextOrder = arrayMove(boardIds, activeIndex, overIndex);
				setCustomOrderIds(nextOrder);
			}
			return;
		}

		if (overContainer === "boards") {
			return;
		}
	};

	const [isAddingBoard, setIsAddingBoard] = useState<boolean>(false);
	const [newBoardTitle, setNewBoardTitle] = useState<string>("");
	const [newBoardColor, setNewBoardColor] = useState<string>("");
	const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);

	const handleStartAddingBoard = () => {
		setIsAddingBoard(true);
		setNewBoardTitle("");
		setNewBoardColor("");
	};

	const handleCancelAddingBoard = () => {
		if (isCreatingBoard) {
			return;
		}
		setIsAddingBoard(false);
		setNewBoardTitle("");
		setNewBoardColor("");
	};

	const handleCreateBoard = async () => {
		const trimmedTitle = newBoardTitle.trim();
		if (!trimmedTitle || isCreatingBoard) {
			return;
		}
		try {
			setIsCreatingBoard(true);
			setIsAddingBoard(false);
			setNewBoardTitle("");
			setNewBoardColor("");
		} catch (error) {
			console.error("Failed to create board", error);
		} finally {
			setIsCreatingBoard(false);
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
							<>
								{Array.from({ length: 3 }).map((_, index) => (
									<div
										key={index}
										className="flex-1 min-w-70 max-w-80 rounded-md bg-sidebar shadow-xs"
									>
										<div className="border-b p-3">
											<Skeleton className="h-5 w-28" />
										</div>
										<div className="space-y-3 p-3">
											{Array.from({ length: 2 }).map((__, skeletonIdx) => (
												<Skeleton
													key={skeletonIdx}
													className="h-16 rounded-md"
												/>
											))}
											<Skeleton className="h-10 rounded-md" />
										</div>
									</div>
								))}
								<div className="flex-1 min-w-70 max-w-80 rounded-md">
									<Skeleton className="h-10 w-full rounded-md" />
								</div>
							</>
						) : orderedBoards.length ? (
							<>
								{orderedBoards.map((board) => (
									<SortableColumn key={board.id} id={board.id}>
										{({ handleProps }) => (
											<>
												<KanbanHeader
													title={board.name}
													color={board.color}
													taskCount={0}
													dragHandleProps={handleProps}
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
											</>
										)}
									</SortableColumn>
								))}
								<div className="flex-1 min-w-70 max-w-80 rounded-md">
									{isAddingBoard ? (
										<InputWithColorPicker
											autoFocus
											value={newBoardTitle}
											onValueChange={setNewBoardTitle}
											color={newBoardColor}
											onColorChange={setNewBoardColor}
											onSubmit={() => {
												void handleCreateBoard();
											}}
											onCancel={handleCancelAddingBoard}
											placeholder="Board name"
											isSubmitting={isCreatingBoard}
										/>
									) : (
										<Button
											onClick={handleStartAddingBoard}
											variant="ghost"
											className="w-full justify-start cursor-pointer gap-1"
										>
											<Plus className="size-4" />
											Add board
										</Button>
									)}
								</div>
							</>
						) : (
							<div className="text-sm text-muted-foreground">
								No boards found for this workspace.
							</div>
						)}
					</div>
				</SortableContext>
				<DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
					{activeId && boardIds.includes(activeId) ? (
						<div className="min-w-70 max-w-80 rounded-md shadow-xl bg-background">
							<KanbanHeader
								title={
									orderedBoards.find((board) => board.id === activeId)?.name ||
									"Board"
								}
								color={
									orderedBoards.find((board) => board.id === activeId)?.color
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

type SortableRenderProps = { handleProps: HTMLAttributes<HTMLDivElement> };

function SortableColumn({
	id,
	children,
}: {
	id: string;
	children: ReactNode | ((props: SortableRenderProps) => ReactNode);
}) {
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
			className={`flex-1 min-w-70 max-w-80 rounded-md transition-shadow ${
				isDragging ? "shadow-xs z-50" : ""
			}`}
		>
			{typeof children === "function"
				? (children as (props: SortableRenderProps) => ReactNode)({
						handleProps: { ...listeners, ...attributes },
					})
				: children}
		</div>
	);
}
