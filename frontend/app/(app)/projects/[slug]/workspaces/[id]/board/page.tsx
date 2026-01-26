"use client";

import { useEffect, use } from "react";
import { KanbanBoard, BoardToolbar } from "@/components/app";
import {
	useGetBoardsByWorkspaceIdQuery,
	useCreateBoardMutation,
	useUpdateBoardMutation,
	useDeleteBoardMutation,
} from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCurrentWorkspace } from "@/store/reducers/project.reducer";
import type { IUpdateBoardPayload } from "@/types/project.interface";

type BoardPageParams = {
	slug: string;
	id: string;
};

export default function BoardPage({
	params,
}: {
	params: Promise<BoardPageParams>;
}) {
	const { slug, id } = use(params);
	const dispatch = useAppDispatch();
	const { workspaces, currentWorkspace } = useAppSelector(
		(state) => state.project,
	);

	useEffect(() => {
		if (!id || !workspaces.length) return;
		const targetWorkspace = workspaces.find((ws) => ws.id === id);
		if (targetWorkspace && targetWorkspace.id !== currentWorkspace?.id) {
			dispatch(setCurrentWorkspace(targetWorkspace));
		}
	}, [id, workspaces, currentWorkspace?.id, dispatch]);

	const { data, isLoading } = useGetBoardsByWorkspaceIdQuery(
		{ projectId: slug, workspaceId: id },
		{ skip: !slug || !id },
	);

	const [createBoard] = useCreateBoardMutation();
	const [updateBoard] = useUpdateBoardMutation();
	const [deleteBoard] = useDeleteBoardMutation();

	const handleCreateBoard = async ({
		name,
		color,
		position,
	}: {
		name: string;
		color?: string;
		position?: number;
	}) => {
		if (!slug || !id) {
			return;
		}
		await createBoard({
			projectId: slug,
			workspaceId: id,
			board: { name, color, position },
		}).unwrap();
	};

	const handleUpdateBoard = async (
		boardId: string,
		payload: IUpdateBoardPayload,
	) => {
		if (!slug || !id) {
			return;
		}
		await updateBoard({
			projectId: slug,
			workspaceId: id,
			boardId,
			board: payload,
		}).unwrap();
	};

	const handleDeleteBoard = async (boardId: string) => {
		if (!slug || !id) {
			return;
		}
		await deleteBoard({
			projectId: slug,
			workspaceId: id,
			boardId,
		}).unwrap();
	};

	return (
		<div className="flex h-full flex-col">
			<BoardToolbar />
			<KanbanBoard
				boards={data?.boards || []}
				isLoading={isLoading}
				onCreateBoard={handleCreateBoard}
				onUpdateBoard={handleUpdateBoard}
				onDeleteBoard={handleDeleteBoard}
			/>
		</div>
	);
}
