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
	MoreVertical,
} from "lucide-react";
import { IProjectResponse } from "@/types/project.interface";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectsTableProps {
	data: IProjectResponse[];
}

export function ProjectsTable({ data }: ProjectsTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

	const columns = useMemo<ColumnDef<IProjectResponse>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<div className="flex items-center justify-center">
						<Checkbox
							checked={
								table.getIsAllPageRowsSelected() ||
								(table.getIsSomePageRowsSelected() &&
									"indeterminate")
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
							onCheckedChange={(value) =>
								row.toggleSelected(!!value)
							}
							aria-label="Select row"
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
				size: 48,
			},
			{
				accessorKey: "name",
				header: "Project",
				size: 240,
				cell: ({ row }) => {
					const project = row.original;
					const initial = project.name
						.split(" ")
						.map((x) => x[0])
						.join("");
					return (
						<div className="flex items-center gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
								{initial}
							</div>
							<p className="font-medium text-foreground">
								{project.name}
							</p>
						</div>
					);
				},
			},
			{
				accessorKey: "type",
				header: "Type",
				size: 120,
				cell: ({ row }) => (
					<Badge
						className={cn(
							"capitalize",
							row.original.type === "personal" && "bg-indigo-500",
							row.original.type === "work" && "bg-cyan-500",
						)}
					>
						{row.original.type}
					</Badge>
				),
			},
			{
				accessorKey: "accessLevel",
				header: "Access",
				size: 120,
				cell: ({ row }) => (
					<Badge
						className={cn(
							"capitalize",
							row.original.accessLevel === "private" &&
								"bg-emerald-500",
							row.original.accessLevel === "public" &&
								"bg-pink-500",
						)}
					>
						{row.original.accessLevel}
					</Badge>
				),
			},
			{
				id: "actions",
				size: 50,
				cell: () => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
								size="icon"
							>
								<MoreVertical />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-32">
							<DropdownMenuItem></DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive cursor-pointer">
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[],
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
		getRowId: (row) => row.id,
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
													header.column.columnDef
														.header,
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
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{
												width: cell.column.getSize(),
											}}
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
					{table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()} pages
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
						onClick={() =>
							table.setPageIndex(table.getPageCount() - 1)
						}
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
