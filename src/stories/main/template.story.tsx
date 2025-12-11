// Package
import { CreateVideStory, type InferVideProps } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Dependencies
import Setup from "../setup";

const controls = {
	visible: true,
};

const story = CreateVideStory(
	{
		vide: Vide,
		controls,
	},
	(storyProps: InferVideProps<typeof controls>) => (
		<Setup
			storyProps={storyProps}
			callback={(_, forge) => {
				forge.set("BottomButtons", storyProps.controls.visible);
			}}
		/>
	),
);

export = story;
