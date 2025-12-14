// Pacakges
import { useSpring } from "@rbxts/loners-pretty-vide-utils";
import { VideApp, VideArgs } from "@rbxts/app-forge";
import Vide from "@rbxts/vide";

@VideApp({
	name: "InventoryInfo",
	renderGroup: "Lobby",
	rules: {
		parent: "Inventory",
	},
})
export class InventoryInfo extends VideArgs {
	public render() {
		const { px } = this.props;

		return (
			<frame
				Name={"Inventory"}
				BackgroundColor3={Color3.fromRGB(60, 60, 60)}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={useSpring(() => new UDim2(1, this.source() ? px(5) : -px(200), 0.5, 0), {
					frequency: 0.4,
					damping: 0.8,
				})}
				Size={() => UDim2.fromOffset(px(200), px(400))}
			/>
		);
	}
}
