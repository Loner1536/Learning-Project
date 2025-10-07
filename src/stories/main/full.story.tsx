// Packages
import { CreateVideStory, Boolean } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Utility
import setup from "../setup";

// Components
import ForgeApp from "@client/controllers/interfaceManager/app";

const controls = {
	topMenu: Boolean(true),
};

const story = CreateVideStory(
	{ vide: Vide, controls },
	setup((props) => {
		props.topMenu.visible = props.controls.topMenu;

		return <ForgeApp props={props} />;
	}),
);

export = story;
