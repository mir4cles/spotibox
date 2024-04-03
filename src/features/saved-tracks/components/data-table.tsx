import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "../../../components/ui/input";
import Filter from "./filter";

interface DataTableProps<TData, TValue> {
	columns: Array<ColumnDef<TData, TValue>>;
	data: Array<TData>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 15,
	});

	const [sorting, setSorting] = useState<SortingState>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		state: {
			pagination,
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter artist..."
					value={(table.getColumn("artists")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("artists")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												<>
													<div
														className={
															header.column.getCanSort()
																? "cursor-pointer select-none"
																: ""
														}
														onClick={header.column.getToggleSortingHandler()}
														title={
															header.column.getCanSort()
																? header.column.getNextSortingOrder() === "asc"
																	? "Sort ascending"
																	: header.column.getNextSortingOrder() ===
																		  "desc"
																		? "Sort descending"
																		: "Clear sort"
																: undefined
														}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: <ArrowUp />,
															desc: <ArrowDown />,
														}[header.column.getIsSorted() as string] ?? null}
													</div>
													{header.column.getCanFilter() ? (
														<div>
															<Filter column={header.column} table={table} />
														</div>
													) : null}
												</>
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
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.previousPage();
					}}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.nextPage();
					}}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
