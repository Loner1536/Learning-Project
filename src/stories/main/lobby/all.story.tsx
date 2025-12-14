// Package
import { CreateVideStory, type InferVideProps } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Dependencies
import Setup from "@stories/setup";

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
			group="Lobby"
			storyProps={storyProps}
			callback={(_, forge) => {
				forge.bind("BottomButtons", storyProps.controls.visible);
			}}
		/>
	),
);

export = story;
