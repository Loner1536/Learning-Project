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
				Name={"InventoryInfo"}
				BackgroundColor3={Color3.fromRGB(50, 50, 50)}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={useSpring(
					() => new UDim2(this.source() ? 1 : 0.5, this.source() ? px(10) : 0, 0.5, 0),
					{
						frequency: 0.25,
						damping: 0.75,
					},
				)}
				Size={() => new UDim2(0, px(250), 1 - 0.1, 0)}
			>
				<uicorner CornerRadius={() => new UDim(0, px(20))} />
			</frame>
		);
	}
}
