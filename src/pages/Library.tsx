import {
	Scopes,
	type Page,
	type SavedTrack,
	type SpotifyApi,
} from "@spotify/web-api-ts-sdk";

import { Fragment, useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { useSpotify } from "../hooks/UseSpotify";

const Library = ({ sdk }: { sdk: SpotifyApi }) => {
	const [savedTracks, setSavedTracks] = useState<Page<SavedTrack>>();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		(async () => {
			const savedTracksResults = await sdk.currentUser.tracks.savedTracks();
			setSavedTracks(savedTracksResults);
		})();
	}, [sdk]);

	if (!savedTracks) {
		return <Fragment>Loading...</Fragment>;
	}

	return (
		<Table>
			<TableCaption>Spotify Search for The Beatles</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="text-left">Name</TableHead>
					<TableHead>Artists</TableHead>
					<TableHead className="text-right">Popularity</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{savedTracks?.items.map((item) => {
					return (
						<TableRow key={item.track.id}>
							<TableCell className="text-left">{item.track.name}</TableCell>
							<TableCell>
								{item.track.artists.map((artist) => artist.name).join(", ")}
							</TableCell>
							<TableCell className="text-right">
								{item.track.popularity}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

export default function LibraryRoute() {
	const sdk = useSpotify(
		import.meta.env["VITE_SPOTIFY_CLIENT_ID"] as string,
		import.meta.env["VITE_REDIRECT_TARGET"] as string,
		[...Scopes.userLibraryRead, ...Scopes.playlistRead, ...Scopes.userDetails]
	);

	return sdk ? <Library sdk={sdk} /> : <Fragment>Error</Fragment>;
}
