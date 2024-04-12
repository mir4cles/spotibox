import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { ModeToggle } from "../components/ui/mode-toggle";

export const Home = (): FunctionComponent => {
	return (
		<div className="bg-blue-300  font-bold w-screen h-screen flex flex-col justify-center items-center">
			<p className="text-white text-6xl">Hello, world!</p>
			<ModeToggle />
			<ul>
				<li>
					<Link to="/library">Library</Link>
				</li>
				<li>
					<Link to="/demo">Demo</Link>
				</li>
			</ul>
		</div>
	);
};
