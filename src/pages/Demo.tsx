import {
	Scopes,
	type AudioFeatures,
	type SavedTrack,
	type SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useCallback } from "react";
import { columns } from "../features/saved-tracks/columns";
import { DataTable } from "../features/saved-tracks/components/data-table";
import { useSpotify } from "../hooks/UseSpotify";

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
				setTimeout(resolve, 100);
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

export async function addSongsToPlaylist(
	sdk: SpotifyApi,
	playlistId: string,
	trackUris: string[]
) {
	await sdk.playlists.addItemsToPlaylist(playlistId, trackUris);
}

export async function createSpotifyPlaylist(
	sdk: SpotifyApi,
	request: {
		name: string;
		description: string;
		public: boolean;
		collaborative: boolean;
	}
) {
	const { id: userId } = await sdk.currentUser.profile();
	return await sdk.playlists.createPlaylist(userId, request);
}

const Demo = ({ sdk }: { sdk: SpotifyApi }) => {
	const { data, isError, error } = useQuery({
		queryKey: ["savedTracks"],
		queryFn: async () => {
			await fetchAllPaginatedData(0, sdk);
			const data = combineData();
			return data;
		},
		staleTime: Number.POSITIVE_INFINITY,
	});

	const handleAddSongs = useCallback(
		async (trackUris: string[]) => {
			const playlist = await createSpotifyPlaylist(sdk, {
				name: "New Playlist",
				description: "Created from selected songs",
				public: true,
				collaborative: false,
			});

			await addSongsToPlaylist(sdk, playlist.id, trackUris);
		},
		[sdk]
	);

	// const { trackUrl } = Route.useSearch();

	if (!data) {
		return <Fragment>Loading...</Fragment>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="container">
			<DataTable
				columns={columns}
				data={data}
				handleAddSongs={handleAddSongs}
			/>
			{/* {trackUrl && (
				<Spotify wide link={trackUrl} allow="autoplay; encrypted-media;" />
			)} */}
		</div>
	);
};

export default function DemoRoute() {
	const sdk = useSpotify(
		import.meta.env["VITE_SPOTIFY_CLIENT_ID"] as string,
		import.meta.env["VITE_REDIRECT_TARGET"] as string,
		[
			...Scopes.userLibraryRead,
			...Scopes.playlistRead,
			...Scopes.playlistModify,
			...Scopes.userDetails,
		]
	);

	return sdk ? <Demo sdk={sdk} /> : <Fragment>Error</Fragment>;
}
