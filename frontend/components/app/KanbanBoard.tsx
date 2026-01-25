"use client";

import {
	useMemo,
	useState,
	useCallback,
	type ReactNode,
	type HTMLAttributes,
} from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	DragOverlay,
	useSensor,
	useSensors,
	type DragEndEvent,
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
import type {
	IBoardResponse,
	IUpdateBoardPayload,
} from "@/types/project.interface";

interface KanbanBoardProps {
	boards?: IBoardResponse[];
	isLoading?: boolean;
	onCreateBoard?: (payload: {
		name: string;
		color?: string;
		position?: number;
	}) => Promise<void> | void;
	onUpdateBoard?: (
		boardId: string,
		payload: IUpdateBoardPayload,
	) => Promise<void> | void;
}

export function KanbanBoard({
	boards = [],
	isLoading = false,
	onCreateBoard,
	onUpdateBoard,
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

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = String(active.id);
		const overId = String(over.id);

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
				const previousOrderState = customOrderIds ? [...customOrderIds] : null;
				const nextOrder = arrayMove(boardIds, activeIndex, overIndex);
				setCustomOrderIds(nextOrder);
				try {
					await persistBoardOrder(nextOrder);
				} catch (error) {
					console.error("Failed to persist board order", error);
					setCustomOrderIds(previousOrderState);
				}
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
	const [pendingBoardMap, setPendingBoardMap] = useState<
		Record<string, number>
	>({});

	const setBoardPending = useCallback((boardId: string, pending: boolean) => {
		setPendingBoardMap((prev) => {
			const currentCount = prev[boardId] ?? 0;
			if (pending) {
				return { ...prev, [boardId]: currentCount + 1 };
			}
			if (currentCount <= 1) {
				const { [boardId]: _removed, ...rest } = prev;
				return rest;
			}
			return { ...prev, [boardId]: currentCount - 1 };
		});
	}, []);

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
		const lastSortedBoard = sortedBoards[sortedBoards.length - 1];
		const basePosition =
			lastSortedBoard && lastSortedBoard.position !== undefined
				? lastSortedBoard.position
				: sortedBoards.length - 1;
		const nextPosition = basePosition + 1;
		try {
			setIsCreatingBoard(true);
			await onCreateBoard?.({
				name: trimmedTitle,
				color: newBoardColor || undefined,
				position: Number.isFinite(nextPosition) ? nextPosition : undefined,
			});
			setIsAddingBoard(false);
			setNewBoardTitle("");
			setNewBoardColor("");
		} catch (error) {
			console.error("Failed to create board", error);
		} finally {
			setIsCreatingBoard(false);
		}
	};

	const handleUpdateBoard = useCallback(
		async (boardId: string, payload: IUpdateBoardPayload) => {
			if (!onUpdateBoard) {
				return;
			}
			try {
				setBoardPending(boardId, true);
				await onUpdateBoard(boardId, payload);
			} catch (error) {
				throw error;
			} finally {
				setBoardPending(boardId, false);
			}
		},
		[onUpdateBoard, setBoardPending],
	);

	const persistBoardOrder = useCallback(
		async (orderedIds: string[]) => {
			if (!onUpdateBoard) {
				return;
			}
			const updates = orderedIds
				.map((boardId, index) => {
					const board = sortedBoards.find((item) => item.id === boardId);
					if (!board) {
						return null;
					}
					const currentPosition = board.position ?? index;
					if (currentPosition === index) {
						return null;
					}
					return { boardId, position: index };
				})
				.filter(
					(update): update is { boardId: string; position: number } =>
						update !== null,
				);
			if (!updates.length) {
				return;
			}
			const results = await Promise.allSettled(
				updates.map(({ boardId, position }) =>
					handleUpdateBoard(boardId, { position }),
				),
			);
			const hasFailure = results.some((result) => result.status === "rejected");
			if (hasFailure) {
				results.forEach((result) => {
					if (result.status === "rejected") {
						console.error("Failed to update board position", result.reason);
					}
				});
				throw new Error("Failed to update board positions");
			}
		},
		[handleUpdateBoard, onUpdateBoard, sortedBoards],
	);

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={async (e) => {
					await handleDragEnd(e);
					setActiveId(null);
				}}
				onDragStart={(e) => {
					setActiveId(String(e.active.id));
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
													onUpdate={(payload) =>
														handleUpdateBoard(board.id, payload)
													}
													isUpdating={Boolean(pendingBoardMap[board.id])}
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
