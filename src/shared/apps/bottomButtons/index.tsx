// Packages
import { VideApp, VideArgs, VideContexts } from "@rbxts/app-forge";
import Vide, { Provider, source, effect } from "@rbxts/vide";
import { useSpring } from "@rbxts/loners-pretty-vide-utils";

// Components
import CategoryButton from "./categoryButton";

@VideApp({ name: "BottomButtons", visible: true })
export class BottomButtons extends VideArgs {
	public render() {
		const { px } = this.props;

		const selected = source(false);
		effect(() => selected(this.source() ? selected() : false));

		return (
			<frame
				Name={"Bottom Buttons"}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={useSpring(
					() => {
						return new UDim2(0.5, 0, 1, this.source() ? 0 : px(300));
					},
					{ frequency: 0.4, damping: 0.8 },
				)}
				Size={() => UDim2.fromOffset(px(600), px(150))}
			>
				<Provider context={VideContexts.App} value={this.props}>
					{() => (
						<>
							<CategoryButton onRelease={() => selected(!selected())} />

							<CategoryButton
								onRelease={() => this.forge.toggle("Inventory")}
								selected={selected}
								delayOut={0.2}
								delayIn={0.05}
							/>
							<CategoryButton selected={selected} delayOut={0.15} delayIn={0.1} />
							<CategoryButton selected={selected} delayOut={0.1} delayIn={0.15} />
							<CategoryButton selected={selected} delayOut={0.05} delayIn={0.2} />
						</>
					)}
				</Provider>

				<uipadding PaddingBottom={() => new UDim(0, px(10))} />
				<uilistlayout
					Padding={() => new UDim(0, px(10))}
					HorizontalAlignment={"Center"}
					VerticalAlignment={"Bottom"}
					FillDirection={"Horizontal"}
				/>
			</frame>
		);
	}
}
