import {
	Scopes,
	type AudioFeatures,
	type SpotifyApi,
	type SavedTrack,
} from "@spotify/web-api-ts-sdk";
import { Fragment } from "react";
import { columns } from "../features/saved-tracks/columns";
import { DataTable } from "../features/saved-tracks/components/data-table";
import { useSpotify } from "../hooks/UseSpotify";
import { useQuery } from "@tanstack/react-query";

const savedTracksData: Array<SavedTrack> = [];
const audioFeaturesData: Array<AudioFeatures> = [];

function combineData(): Array<SavedTrack & { audioFeature?: AudioFeatures }> {
	const combinedData = savedTracksData.map((savedTrack) => {
		const audioFeature = audioFeaturesData.find(
			(audioFeature) => audioFeature.id === savedTrack.track.id
		);

		return {
			...savedTrack,
			audioFeature,
		};
	});

	return combinedData;
}

async function fetchAllPaginatedData(offset = 0, sdk: SpotifyApi) {
	let hasMore = true;

	try {
		const savedTracksResponse = await sdk.currentUser.tracks.savedTracks(
			50,
			offset
		);
		const { items, next, total } = savedTracksResponse;
		hasMore = next !== null;

		const audioFeatures = await sdk.tracks.audioFeatures(
			items.map((item) => item.track.id)
		);

		savedTracksData.push(...items);

		audioFeaturesData.push(...audioFeatures);

		if (hasMore) {
			offset += 50;
			await new Promise((resolve) => {
				setTimeout(resolve, 200);
			});
			console.debug(offset, "/", total);
			await fetchAllPaginatedData(offset, sdk);
			return;
		}

		// console.clear();
		console.info("Data complete.");

		return;
	} catch (error) {
		console.error(error);
	}
}

const Demo = ({ sdk }: { sdk: SpotifyApi }) => {
	const query = useQuery({
		queryKey: ["savedTracks"],
		queryFn: async () => {
			await fetchAllPaginatedData(0, sdk);
			const data = combineData();
			return data;
		},
	});

	console.log(query);

	if (!query.data) {
		return <Fragment>Loading...</Fragment>;
	}

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={query.data} />
		</div>
	);
};

export default function DemoRoute() {
	const sdk = useSpotify(
		import.meta.env["VITE_SPOTIFY_CLIENT_ID"] as string,
		import.meta.env["VITE_REDIRECT_TARGET"] as string,
		[...Scopes.userLibraryRead, ...Scopes.playlistRead, ...Scopes.userDetails]
	);

	return sdk ? <Demo sdk={sdk} /> : <Fragment>Error</Fragment>;
}
