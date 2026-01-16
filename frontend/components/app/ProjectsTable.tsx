"use client";

import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	ChevronsLeft,
	ChevronsRight,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { IProjectWithMembershipResponse } from "@/types/project.interface";

interface ProjectsTableProps {
	data: IProjectWithMembershipResponse[];
	selectedProjectId: string | null;
	onSelect: (projectId: string) => void;
}

export function ProjectsTable({
	data,
	selectedProjectId,
	onSelect,
}: ProjectsTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

	const columns = useMemo<ColumnDef<IProjectWithMembershipResponse>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<div className="flex items-center justify-center">
						<Checkbox
							checked={
								table.getIsAllPageRowsSelected() ||
								(table.getIsSomePageRowsSelected() && "indeterminate")
							}
							onCheckedChange={(value) =>
								table.toggleAllPageRowsSelected(!!value)
							}
							aria-label="Select all"
						/>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							aria-label="Select row"
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
				size: 48,
			},
			{
				accessorKey: "project.name",
				header: "Project",
				size: 240,
				cell: ({ row }) => {
					const { project } = row.original;
					const initial = project.name?.charAt(0).toUpperCase() || "?";
					return (
						<div className="flex items-center gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
								{initial}
							</div>
							<div className="space-y-0.5">
								<p className="text-sm font-medium text-foreground">
									{project.name}
								</p>
								<p className="text-xs text-muted-foreground line-clamp-1">
									{project.description || "No description provided."}
								</p>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "project.type",
				header: "Type",
				size: 120,
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.original.project.type}
					</Badge>
				),
			},
			{
				accessorKey: "project.accessLevel",
				header: "Access",
				size: 120,
				cell: ({ row }) => (
					<Badge variant="secondary" className="capitalize">
						{row.original.project.accessLevel}
					</Badge>
				),
			},
			{
				accessorKey: "membership.role",
				header: "Role",
				size: 120,
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.original.membership.role}
					</Badge>
				),
			},
			{
				id: "actions",
				size: 140,
				header: "",
				cell: ({ row }) => {
					const projectId = row.original.project.id;
					const isSelected = projectId === selectedProjectId;
					return (
						<Button
							variant={isSelected ? "default" : "outline"}
							size="sm"
							onClick={() => onSelect(projectId)}
						>
							{isSelected ? "Selected" : "Select"}
						</Button>
					);
				},
				enableSorting: false,
			},
		],
		[selectedProjectId, onSelect],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
			pagination,
		},
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getRowId: (row) => row.project.id,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted/40">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										style={{ width: header.getSize() }}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{ width: cell.column.getSize() }}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-sm text-muted-foreground"
								>
									No projects found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="text-sm text-muted-foreground">
					{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}{" "}
					pages
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
