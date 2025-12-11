// Packages
import { VideApp, VideArgs, VideContexts, useVideAppContext } from "@rbxts/app-forge";
import Vide, { Provider, source, effect } from "@rbxts/vide";
import { useSpring } from "@rbxts/loners-pretty-vide-utils";

// Components
import { ReactiveButton } from "../components/button";

type ButtonProps = {
	selected?: Vide.Source<boolean>;

	delayOut?: number;
	delayIn?: number;

	onRelease?: () => void;
};

@VideApp({ name: "BottomButtons", visible: true })
export class BottomButtons extends VideArgs {
	Button = ({ selected, delayOut = 0, delayIn = 0, onRelease }: ButtonProps) => {
		const { px } = useVideAppContext();

		const transparency = source(selected && selected() ? 1 : 0);
		return (
			<ReactiveButton
				properties={(multi) => {
					if (selected) {
						effect(() => {
							if (selected()) {
								task.delay(delayIn, () => {
									if (!selected()) return;

									transparency(0);
									multi(1);
								});
							} else {
								task.delay(delayOut, () => {
									if (selected()) return;

									transparency(1);
									multi(0);
								});
							}
						});
					}
					return {
						BackgroundTransparency: useSpring(transparency, { frequency: 0.25, damping: 0.75 }),
						Size: useSpring(() => UDim2.fromOffset(px(125) * multi(), px(125) * multi()), {
							frequency: 0.25,
							damping: 0.5,
						}),
					};
				}}
				events={{
					MouseButton1Up: () => onRelease?.(),
				}}
			>
				<uicorner CornerRadius={() => new UDim(0, px(20))} />
			</ReactiveButton>
		);
	};

	render() {
		const { px } = this.props;

		const selected = source(false);
		effect(() => selected(this.source() ? selected() : false));

		return (
			<frame
				Name={"Bottom Buttons"}
				BackgroundTransparency={0.9}
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
							<this.Button onRelease={() => selected(!selected())} />
							<this.Button selected={selected} delayIn={0.05} delayOut={0.15} />
							<this.Button selected={selected} delayIn={0.1} delayOut={0.1} />
							<this.Button selected={selected} delayIn={0.15} delayOut={0.05} />
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
