/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Column, Table } from "@tanstack/react-table";
import type { FC } from "react";
import DebouncedInput from "./debounced-input";

interface FilterProps {
	column: Column<any, unknown>;
	table: Table<any>;
}

const Filter: FC<FilterProps> = ({ column, table }) => {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id);

	const columnFilterValue = column.getFilterValue();

	return typeof firstValue === "number" ? (
		<div>
			<div className="flex space-x-2">
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) => {
						column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
					}}
					placeholder={`Min ${
						column.getFacetedMinMaxValues()?.[0]
							? `(${column.getFacetedMinMaxValues()?.[0]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
				<DebouncedInput
					type="number"
					min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
					max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) => {
						column.setFilterValue((old: [number, number]) => [old?.[0], value]);
					}}
					placeholder={`Max ${
						column.getFacetedMinMaxValues()?.[1]
							? `(${column.getFacetedMinMaxValues()?.[1]})`
							: ""
					}`}
					className="w-24 border shadow rounded"
				/>
			</div>
			<div className="h-1" />
		</div>
	) : (
		<>
			<DebouncedInput
				type="text"
				value={(columnFilterValue ?? "") as string}
				onChange={(value) => {
					column.setFilterValue(value);
				}}
				placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
				className="w-36 border shadow rounded"
				list={column.id + "list"}
			/>
			<div className="h-1" />
		</>
	);
};

export default Filter;
