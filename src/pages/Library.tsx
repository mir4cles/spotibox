import {
	Scopes,
	type AudioFeatures,
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
	const [audioFeatures, setAudioFeatures] = useState<Array<AudioFeatures>>();

	console.log({ savedTracks, audioFeatures });

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		(async () => {
			const savedTracksResults = await sdk.currentUser.tracks.savedTracks(
				50,
				50
			);
			setSavedTracks(savedTracksResults);
		})();
	}, [sdk]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		(async () => {
			if (savedTracks) {
				const trackIds = savedTracks.items.map((item) => item.track.id);
				const audioFeatures = await sdk.tracks.audioFeatures(trackIds);
				setAudioFeatures(audioFeatures);
			}
		})();
	}, [savedTracks, sdk.tracks]);

	if (!savedTracks || !audioFeatures) {
		return <Fragment>Loading...</Fragment>;
	}

	return (
		<Table>
			<TableCaption>Saved tracks</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="text-left">Name</TableHead>
					<TableHead>Artists</TableHead>
					<TableHead className="text-right">Popularity</TableHead>
					<TableHead className="text-right">Danceability</TableHead>
					<TableHead className="text-right">Key</TableHead>
					<TableHead className="text-right">Tempo</TableHead>
					<TableHead className="text-right">Accousticness</TableHead>
					<TableHead className="text-right">Valence</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{savedTracks.items.map((item) => {
					const audioFeature = audioFeatures.find(
						(feature) => feature.id === item.track.id
					);
					return (
						<TableRow key={item.track.id}>
							<TableCell className="text-left">{item.track.name}</TableCell>
							<TableCell>
								{item.track.artists.map((artist) => artist.name).join(", ")}
							</TableCell>
							<TableCell className="text-right">
								{item.track.popularity}
							</TableCell>
							<TableCell className="text-right">
								{audioFeature?.danceability.toLocaleString("en", {
									style: "percent",
								})}
							</TableCell>
							<TableCell className="text-right">{audioFeature?.key}</TableCell>
							<TableCell className="text-right">
								{audioFeature?.tempo}
							</TableCell>
							<TableCell className="text-right">
								{audioFeature?.acousticness.toLocaleString("en", {
									style: "percent",
								})}
							</TableCell>
							<TableCell className="text-right">
								{audioFeature?.valence.toLocaleString("en", {
									style: "percent",
								})}
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
