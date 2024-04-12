import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";
import DebouncedInput from "./debounced-input";

interface DataTableProps<TData, TValue> {
	columns: Array<ColumnDef<TData, TValue>>;
	data: Array<TData>;
	handleAddSongs: (trackUris: string[]) => Promise<void>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	handleAddSongs,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},
	});

	// TODO: type this
	const selectedTracks = useMemo(() => {
		const trackUris = table
			.getSelectedRowModel()
			.rows.map((row) => row.original.track.uri as string);
		return trackUris;
	}, [table]);

	console.log(selectedTracks);

	return (
		<div className="h-screen flex flex-col">
			<button
				type="button"
				onClick={async () => {
					await handleAddSongs(selectedTracks);
				}}
			>
				Create Playlist from Selected Songs
			</button>
			<div className="flex items-center py-4 gap-4">
				<DebouncedInput
					placeholder="Filter title..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(value) => table.getColumn("title")?.setFilterValue(value)}
					className="max-w-sm"
				/>
				<DebouncedInput
					type="number"
					placeholder="BPM min..."
					value={
						(
							table.getColumn("tempo")?.getFilterValue() as [number, number]
						)?.[0] ?? ""
					}
					onChange={(value) =>
						table
							.getColumn("tempo")
							?.setFilterValue((old: [number, number]) => [value, old?.[1]])
					}
					className="max-w-sm"
				/>
				<DebouncedInput
					type="number"
					placeholder="BPM max..."
					value={
						(
							table.getColumn("tempo")?.getFilterValue() as [number, number]
						)?.[1] ?? ""
					}
					onChange={(value) =>
						table
							.getColumn("tempo")
							?.setFilterValue((old: [number, number]) => [old?.[0], value])
					}
					className="max-w-sm"
				/>
				<DebouncedInput
					type="number"
					placeholder="NRG min..."
					value={
						(
							table.getColumn("energy")?.getFilterValue() as [number, number]
						)?.[0] ?? ""
					}
					onChange={(value) =>
						table
							.getColumn("energy")
							?.setFilterValue((old: [number, number]) => [value, old?.[1]])
					}
					className="max-w-sm"
				/>
				<DebouncedInput
					type="number"
					placeholder="NRG max..."
					value={
						(
							table.getColumn("energy")?.getFilterValue() as [number, number]
						)?.[1] ?? ""
					}
					onChange={(value) =>
						table
							.getColumn("energy")
							?.setFilterValue((old: [number, number]) => [old?.[0], value])
					}
					className="max-w-sm"
				/>
				<Button
					onClick={() => {
						table.resetColumnFilters(true);
					}}
				>
					Reset filters
				</Button>
			</div>
			<div className="rounded-md border overflow-y-auto">
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
			<div className="flex items-center gap-2 my-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.setPageIndex(0);
					}}
					disabled={!table.getCanPreviousPage()}
				>
					{"<<"}
				</Button>
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
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.setPageIndex(table.getPageCount() - 1);
					}}
					disabled={!table.getCanNextPage()}
				>
					{">>"}
				</Button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<div>({table.getPrePaginationRowModel().rows.length} Rows)</div>
			</div>
		</div>
	);
}
