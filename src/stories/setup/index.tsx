// Packages
import Forge from "@rbxts/forge";

// Types
import type { InferVideProps } from "@rbxts/ui-labs";

// Types
import { type ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import type * as Types from "@shared/types";

// Utility
import px from "@shared/utility/px";

// Dependencies
import InterfaceManager from "@client/controllers/interfaceManager";
import JecsManager from "@client/controllers/jecsManager";

export default function setup<T extends ReturnControls>(
	callback: (props: InferVideProps<T> & Types.InterfaceProps.default) => Vide.Node,
) {
	return (props: InferVideProps<T>) => {
		const mockedPlayer = {
			Name: "UI-Labs Player",
			UserId: 123456,
		} as Player;

		const jecsManager = new JecsManager();
		const interfaceManager = new InterfaceManager(jecsManager);

		const interfaceProps = interfaceManager.buildProps(mockedPlayer);
		if (!interfaceProps) error("Failed to build interface props for UI-Labs");

		Forge.render(props.target);
		px.setTarget(props.target);

		return callback({ ...props, ...interfaceProps });
	};
}
