import { createLazyFileRoute } from "@tanstack/react-router";
import LibraryRoute from "../pages/Library";

export const Route = createLazyFileRoute("/library")({
	component: LibraryRoute,
});
