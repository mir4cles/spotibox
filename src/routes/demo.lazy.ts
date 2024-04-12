import { createFileRoute } from "@tanstack/react-router";
import DemoRoute from "../pages/Demo";

export const Route = createFileRoute("/demo")({
	component: DemoRoute,
	validateSearch: (search: { trackUrl?: string }) => {
		return {
			trackUrl: search.trackUrl || "",
		};
	},
});
