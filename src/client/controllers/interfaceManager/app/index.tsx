// Packages
import Forge from "@rbxts/forge";

// Types
import type * as Types from "@shared/types";

// Components
import Vote from "@shared/interface/vote";

export default function ForgeApp({ props }: { props: Types.InterfaceProps.default }) {
	return [
		Forge.add({
			component: Vote,
			visible: props.vote.visible,
			args: [{ props }],
			fadeSpeed: 0.25,
			window: false,
		}),
	];
}
