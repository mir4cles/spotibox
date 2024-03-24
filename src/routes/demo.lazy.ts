import { createLazyFileRoute } from "@tanstack/react-router";
import DemoRoute from "../pages/Demo";

export const Route = createLazyFileRoute("/demo")({
	component: DemoRoute,
});
