"use client";

import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	CircleCheck,
	CircleDashed,
	MoreVertical,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { IUser, IUserRequestInvite } from "@/types/user.interface";

const createPeopleColumns = (): ColumnDef<IUser>[] => [
	{
		id: "select",
		size: 50,
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
	},
	{
		accessorKey: "fullname",
		header: "Full Name",
		size: 200,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-1 text-sm">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${row.original.colorAvatar}`}
					>
						{row.original.fullname
							.split(" ")
							.map((x) => x[0])
							.join("")}
					</div>
					<span className="text-primary/80">
						{row.original.fullname}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "username",
		header: "Username",
		size: 150,
		cell: ({ row }) => {
			return <div className="capitalize">{row.original.username}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: "Email",
		size: 200,
		cell: ({ row }) => {
			return <div>{row.original.email}</div>;
		},
	},
	{
		accessorKey: "jobTitle",
		header: "Job Title",
		size: 280,
		cell: ({ row }) => {
			return <div>{row.original.jobTitle}</div>;
		},
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
					<DropdownMenuItem>Add to teams</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

const createRequestColumns = (): ColumnDef<IUserRequestInvite>[] => [
	{
		id: "select",
		size: 50,
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
	},
	{
		accessorKey: "fullname",
		header: "Full Name",
		size: 200,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-1 text-sm">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${row.original.colorAvatar}`}
					>
						{row.original.fullname
							.split(" ")
							.map((x) => x[0])
							.join("")}
					</div>
					<span className="text-primary/80">
						{row.original.fullname}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "username",
		header: "Username",
		size: 150,
		cell: ({ row }) => {
			return <div className="capitalize">{row.original.username}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: "Email",
		size: 200,
		cell: ({ row }) => {
			return <div>{row.original.email}</div>;
		},
	},
	{
		accessorKey: "jobTitle",
		header: "Job Title",
		size: 180,
		cell: ({ row }) => {
			return <div>{row.original.jobTitle}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		size: 150,
		cell: ({ row }) => (
			<Badge variant="outline" className="text-muted-foreground px-1.5">
				{row.original.status === "accepted" ? (
					<CircleCheck className="fill-green-500" />
				) : (
					<CircleDashed className="fill-red-500" />
				)}
				<span className="ml-1 capitalize">{row.original.status}</span>
			</Badge>
		),
	},
];

type PeopleTableProps =
	| {
			data: IUser[];
			type: "people";
	  }
	| {
			data: IUserRequestInvite[];
			type: "request";
	  };

export function PeopleTable({ data, type }: PeopleTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 5,
	});

	const columns = useMemo(() => {
		return type === "request"
			? createRequestColumns()
			: createPeopleColumns();
	}, [type]) as ColumnDef<any>[];

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div>
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												width: header.getSize(),
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
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
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-4 py-2">
				<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex w-full items-center gap-8 lg:w-fit">
					<div className="flex w-fit items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden size-8 lg:flex"
							size="icon"
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
