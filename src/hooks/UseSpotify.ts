/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line unicorn/filename-case
import {
	AuthorizationCodeWithPKCEStrategy,
	type SdkOptions,
	SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useRef, useState } from "react";

export function useSpotify(
	clientId: string,
	redirectUrl: string,
	scopes: Array<string>,
	config?: SdkOptions
): SpotifyApi | null {
	const [sdk, setSdk] = useState<SpotifyApi | null>(null);
	const { current: activeScopes } = useRef(scopes);

	useEffect(() => {
		(async (): Promise<void> => {
			const auth = new AuthorizationCodeWithPKCEStrategy(
				clientId,
				redirectUrl,
				activeScopes
			);
			const internalSdk = new SpotifyApi(auth, config);

			try {
				const { authenticated } = await internalSdk.authenticate();

				if (authenticated) {
					setSdk(() => internalSdk);
				}
				// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
			} catch (error_: Error | unknown) {
				const error = error_ as Error;
				if (
					error &&
					error.message &&
					error.message.includes("No verifier found in cache")
				) {
					console.error(
						"If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
						error
					);
				} else {
					console.error(error_);
				}
			}
		})();
	}, [clientId, redirectUrl, config, activeScopes]);

	return sdk;
}
