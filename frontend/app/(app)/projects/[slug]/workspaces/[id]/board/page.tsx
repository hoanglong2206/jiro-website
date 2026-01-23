"use client";

import { useEffect, use } from "react";
import { KanbanBoard, BoardToolbar } from "@/components/app";
import { useGetBoardsByWorkspaceIdQuery } from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCurrentWorkspace } from "@/store/reducers/project.reducer";

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

	return (
		<div className="flex h-full flex-col">
			<BoardToolbar />
			<KanbanBoard boards={data?.boards || []} isLoading={isLoading} />
		</div>
	);
}
