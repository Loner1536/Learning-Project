// Packages
import { CreateVideStory, Boolean } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Utility
import setup from "../setup";

// Components
import ForgeApp from "@client/controllers/interfaceManager/app";

const controls = {};

const story = CreateVideStory(
	{ vide: Vide, controls },
	setup((props) => {
		return <ForgeApp props={props} />;
	}),
);

export = story;
