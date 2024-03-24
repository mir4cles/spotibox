import {
	Scopes,
	type SpotifyApi,
	type SavedTrack,
} from "@spotify/web-api-ts-sdk";
import { Fragment, useEffect, useState } from "react";
import { columns } from "../features/saved-tracks/columns";
import { DataTable } from "../features/saved-tracks/components/data-table";
import { useSpotify } from "../hooks/UseSpotify";

async function getData(sdk: SpotifyApi): Promise<Array<SavedTrack>> {
	// Fetch data from your API here.
	let offset = 0;
	let hasMore = true;
	let tracks: Array<SavedTrack> = [];

	while (hasMore) {
		const savedTracks = await sdk.currentUser.tracks.savedTracks(50, offset);
		tracks = [...tracks, ...savedTracks.items];
		hasMore = savedTracks.next !== null;
		offset += 50;
	}

	return tracks;
}

const Demo = ({ sdk }: { sdk: SpotifyApi }) => {
	const [data, setData] = useState<Array<SavedTrack>>([]);

	useEffect(() => {
		const fetchData = async () => {
			const tracks = await getData(sdk);
			setData(tracks);
		};

		void fetchData();
	}, [sdk]);

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
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
