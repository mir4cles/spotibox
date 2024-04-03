import type {
	AudioFeatures,
	SavedTrack,
	SimplifiedArtist,
} from "@spotify/web-api-ts-sdk";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: Array<
	ColumnDef<SavedTrack & { audioFeature?: AudioFeatures }>
> = [
	{
		accessorKey: "track.name",
		header: "Name",
	},
	{
		id: "artists",
		accessorKey: "track.artists",
		enableSorting: false,
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
		filterFn: "inNumberRange",
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
