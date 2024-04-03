"use client";

import type { AudioFeatures, SavedTrack } from "@spotify/web-api-ts-sdk";
import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Track = {
// 	id: string;
// 	name: number;
// 	artists: string;
// 	popularity: string;
// 	danceability: string;
// 	key: string;
// 	tempo: string;
// 	instrumentalness: string;
// 	valence: string;
// }

// export type CustomSavedTracks = SavedTrack & { audioFeatures: AudioFeatures };

export const columns: Array<
	ColumnDef<SavedTrack & { audioFeature?: AudioFeatures }>
> = [
	{
		accessorKey: "track.name",
		header: "Name",
	},
	{
		accessorKey: "track.artists",
		header: "Artists",
	},
	{
		accessorKey: "track.popularity",
		header: "Popularity",
	},
	{
		accessorKey: "added_at",
		header: "Added at",
	},
	{
		accessorKey: "audioFeature.danceability",
		header: "Danceability",
	},
	{
		accessorKey: "audioFeature.key",
		header: "Key",
	},
	{
		accessorKey: "audioFeature.tempo",
		header: "Tempo",
	},
	{
		accessorKey: "audioFeature.instrumentalness",
		header: "Instrumentalness",
	},
	{
		accessorKey: "audioFeature.valence",
		header: "Valence",
	},
];
