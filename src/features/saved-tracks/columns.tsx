import type {
	AudioFeatures,
	SavedTrack,
	SimplifiedArtist,
} from "@spotify/web-api-ts-sdk";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../components/ui/checkbox";

export const columns: ColumnDef<
	SavedTrack & { audioFeature?: AudioFeatures }
>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => {
					table.toggleAllPageRowsSelected(!!value);
				}}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={row.getToggleSelectedHandler()}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	// TODO: Implement play button
	// {
	// 	id: "play",
	// 	cell: ({ row }) => {
	// 		const navigate = useNavigate();
	// 		const trackUrl = row.original.track.external_urls.spotify;
	// 		return (
	// 			<Button
	// 				variant="ghost"
	// 				onClick={() => navigate({ search: { trackUrl } })}
	// 			>
	// 				<CirclePlay />
	// 			</Button>
	// 		);
	// 	},
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		id: "title",
		accessorKey: "track.name",
		header: "Title",
	},
	{
		id: "artists",
		accessorKey: "track.artists",
		sortingFn: (rowA, rowB) => {
			const artistsA: Array<SimplifiedArtist> = rowA.getValue("artists");
			const artistsB: Array<SimplifiedArtist> = rowB.getValue("artists");

			const artistA = artistsA.map((artist) => artist.name).join(", ");
			const artistB = artistsB.map((artist) => artist.name).join(", ");

			return artistA.localeCompare(artistB);
		},
		header: "Artists",
		cell: ({ row }) => {
			const artists: Array<SimplifiedArtist> = row.getValue("artists");
			return artists.map((artist) => artist.name).join(", ");
		},
	},
	{
		accessorKey: "track.popularity",
		header: "Popularity",
	},
	{
		id: "added_at",
		accessorKey: "added_at",
		header: "Added at",
		cell: ({ row }) => {
			const date = new Date(row.getValue("added_at"));
			return date.toLocaleDateString();
		},
	},
	{
		id: "danceability",
		accessorKey: "audioFeature.danceability",
		header: "Danceability",
		cell: ({ row }) => {
			const danceability: AudioFeatures["danceability"] =
				row.getValue("danceability");
			return danceability.toLocaleString("en", {
				style: "percent",
			});
		},
	},
	{
		id: "energy",
		accessorKey: "audioFeature.energy",
		header: "NRG",
		cell: ({ row }) => {
			const danceability: AudioFeatures["energy"] = row.getValue("energy");
			return danceability.toLocaleString("en", {
				style: "percent",
			});
		},
	},
	{
		accessorKey: "audioFeature.key",
		header: "Key",
	},
	{
		id: "tempo",
		header: "BPM",
		accessorKey: "audioFeature.tempo",
		cell: ({ row }) => {
			const tempo: AudioFeatures["tempo"] = row.getValue("tempo");
			return tempo.toLocaleString("en", {
				style: "decimal",
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			});
		},
		footer: (props) => props.column.id,
	},
	{
		id: "instrumentalness",
		accessorKey: "audioFeature.instrumentalness",
		header: "Instrumentalness",
		cell: ({ row }) => {
			const instrumentalness: AudioFeatures["instrumentalness"] =
				row.getValue("instrumentalness");
			return instrumentalness.toLocaleString("en", {
				style: "percent",
			});
		},
	},
	{
		id: "valence",
		accessorKey: "audioFeature.valence",
		header: "Valence",
		cell: ({ row }) => {
			const valence: AudioFeatures["valence"] = row.getValue("valence");
			return valence.toLocaleString("en", {
				style: "percent",
			});
		},
	},
];
