// Pacakges
import { useSpring } from "@rbxts/loners-pretty-vide-utils";
import { VideApp, VideArgs } from "@rbxts/app-forge";
import Vide from "@rbxts/vide";

// Components
import { ReactiveButton } from "@shared/apps/components/button";

@VideApp({
	name: "Inventory",
	renderGroup: "Lobby",
	rules: {
		index: 2,
	},
})
export class Inventory extends VideArgs {
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
			>
				<ReactiveButton
					properties={(multi) => {
						return {
							AnchorPoint: new Vector2(0.5, 0.5),
							Position: UDim2.fromScale(0.5, 0.5),
							Size: useSpring(() => UDim2.fromOffset(px(125) * multi(), px(75) * multi()), {
								frequency: 0.25,
								damping: 0.5,
							}),
						};
					}}
					events={{
						MouseButton1Up: () => this.forge.toggle("InventoryInfo"),
					}}
				>
					<uicorner CornerRadius={() => new UDim(0, px(20))} />
				</ReactiveButton>
			</frame>
		);
	}
}
