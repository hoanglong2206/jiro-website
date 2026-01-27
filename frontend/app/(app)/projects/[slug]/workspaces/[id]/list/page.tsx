"use client";

import { Fragment, use, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ChevronDown,
	ChevronRight,
	Filter,
	Plus,
	Search,
	Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetBoardsByWorkspaceIdQuery } from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCurrentWorkspace } from "@/store/reducers/project.reducer";

type ListPageParams = {
	slug: string;
	id: string;
};

export default function ListPage({
	params,
}: {
	params: Promise<ListPageParams>;
}) {
	const { slug, id } = use(params);
	const dispatch = useAppDispatch();
	const { workspaces, currentWorkspace } = useAppSelector(
		(state) => state.project,
	);
	const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

	useEffect(() => {
		if (!id || !workspaces.length) {
			return;
		}
		const targetWorkspace = workspaces.find((ws) => ws.id === id);
		if (targetWorkspace && targetWorkspace.id !== currentWorkspace?.id) {
			dispatch(setCurrentWorkspace(targetWorkspace));
		}
	}, [id, workspaces, currentWorkspace?.id, dispatch]);

	const { data, isLoading } = useGetBoardsByWorkspaceIdQuery(
		{ projectId: slug, workspaceId: id },
		{ skip: !slug || !id },
	);

	const boards = useMemo(() => data?.boards ?? [], [data?.boards]);

	const toggleGroup = (boardId: string) => {
		setCollapsedGroups((prev) =>
			prev.includes(boardId)
				? prev.filter((idValue) => idValue !== boardId)
				: [...prev, boardId],
		);
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search list"
							className="h-9 w-48 bg-muted pl-9 focus-visible:ring-primary"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						className="gap-2 text-muted-foreground cursor-pointer"
					>
						<Filter className="h-4 w-4" />
						Filter
					</Button>
					<Button
						variant="ghost"
						size={"icon"}
						className="gap-2 cursor-pointer"
					>
						<Upload className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-auto p-6">
				<div className="rounded-lg border border-border">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50">
								<TableHead className="w-12"></TableHead>
								<TableHead className="w-32">Key</TableHead>
								<TableHead className="w-80">Summary</TableHead>
								<TableHead className="w-32">Status</TableHead>
								<TableHead className="w-48">Assignee</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="py-12 text-center text-sm text-muted-foreground"
									>
										Loading boards...
									</TableCell>
								</TableRow>
							) : !boards.length ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="py-12 text-center text-sm text-muted-foreground"
									>
										No boards found for this workspace.
									</TableCell>
								</TableRow>
							) : (
								boards.map((board) => {
									const isExpanded = !collapsedGroups.includes(board.id);
									const taskCount = 0;

									return (
										<Fragment key={board.id}>
											<TableRow
												className="cursor-pointer bg-muted/30 hover:bg-muted/50"
												onClick={() => toggleGroup(board.id)}
											>
												<TableCell colSpan={8}>
													<div className="flex items-center gap-2">
														{isExpanded ? (
															<ChevronDown className="h-4 w-4" />
														) : (
															<ChevronRight className="h-4 w-4" />
														)}
														<span
															className="h-2.5 w-2.5 rounded-full"
															style={{
																backgroundColor: board.color || "#d1d5db",
															}}
														/>
														<span className="font-medium uppercase">
															{board.name}
														</span>
														<Badge variant="secondary" className="ml-2">
															{taskCount}
														</Badge>
													</div>
												</TableCell>
											</TableRow>

											{isExpanded && (
												<TableRow className="hover:bg-muted/30">
													<TableCell colSpan={8}>
														<Button
															variant="ghost"
															className="h-9 w-full justify-start gap-2 text-muted-foreground cursor-pointer"
														>
															<Plus className="h-4 w-4" />
															Add Task
														</Button>
													</TableCell>
												</TableRow>
											)}
										</Fragment>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
