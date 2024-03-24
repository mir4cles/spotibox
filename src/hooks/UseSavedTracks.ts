import type { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

// Custom hook to fetch saved tracks
export function useSavedTracks(sdk: SpotifyApi) {
	return useInfiniteQuery({
		queryKey: ["savedTracks"],
		queryFn: async ({ pageParam: pageParameter = 0 }) => {
			const savedTracksResults = await sdk.currentUser.tracks.savedTracks(
				50,
				pageParameter
			);
			console.log(savedTracksResults);

			return savedTracksResults;
		},
		initialPageParam: 0,
		getNextPageParam: (
			lastPage,
			allPages,
			lastPageParameter,
			allPageParameters
		) => {
			if (lastPage.next) {
				return lastPageParameter + 50;
			}
			if (lastPageParameter === 0) {
				return 50;
			}
			return;
		},
		getPreviousPageParam: (
			firstPage,
			allPages,
			firstPageParameter,
			allPageParameters
		) => {
			if (firstPage.previous) {
				return firstPageParameter - 50;
			}
			return;
		},
	});
}
