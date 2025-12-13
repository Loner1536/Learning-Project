// Pacakges
import { useSpring } from "@rbxts/loners-pretty-vide-utils";
import { VideApp, VideArgs } from "@rbxts/app-forge";
import Vide from "@rbxts/vide";

@VideApp({
	name: "Inventory",
})
export class PopupA extends VideArgs {
	public render() {
		const { px } = this.props;

		return (
			<frame
				Name={"Inventory"}
				BackgroundColor3={Color3.fromRGB(100, 100, 100)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={useSpring(() => new UDim2(0.5, 0, 0.5, this.source() ? 0 : px(1000)), {
					frequency: 0.4,
					damping: 0.8,
				})}
				Size={() => UDim2.fromOffset(px(500), px(500))}
			/>
		);
	}
}
