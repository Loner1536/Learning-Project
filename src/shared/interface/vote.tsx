// Packages
import Vide, { source, spring } from "@rbxts/vide";

// Types
import type * as Types from "@shared/types";

// Utility
import px from "@shared/utility/px";

// Components
import Button from "./components/button";

export default function Vote({ props }: { props: Types.InterfaceProps.default }) {
	const onHover = source(false);
	const onPress = source(false);

	return (
		<frame
			Name={"Vote"}
			BackgroundColor3={Color3.fromRGB(40, 40, 40)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={px.useSpring(
				(scale) => {
					const yOffset = props.vote.visible() ? 100 : -100;
					return scale.useUDim2(0.5, 0, 0, yOffset);
				},
				0.3,
				0.6,
			)}
			Size={px.useUDim2(300, 100)}
		>
			<uicorner CornerRadius={px.useUDim(20)} />

			<frame
				Name={"Confirm"}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={px.useUDim2(0.5, 0, 1, -10)}
				Size={px.useSpring(
					(scale) => {
						const multi = onPress() ? 0.925 : onHover() ? 1.075 : 1;
						return scale.useUDim2(100 * multi, 50 * multi);
					},
					0.3,
					0.6,
				)}
			>
				<uicorner CornerRadius={px.useUDim(20)} />
				<Button
					events={{
						MouseEnter: () => onHover(true),
						MouseLeave: () => onHover(false),
						MouseButton1Down: () => onPress(true),
						MouseButton1Up: () => {
							onPress(false);

							props.network.server
								.invoke(props.network.keys.wave.vote, props.network.keys.wave.voteReturn)
								.then((success) => {
									if (!success) return;

									const { world, C } = props.core;

									for (const [e, userId] of world.query(C.Player.UserId).with(C.Tags.Player)) {
										if (props.player.UserId === userId) {
											world.set(e, C.Player.Voted, true);
										}
									}
								});
						},
					}}
				/>
			</frame>
		</frame>
	);
}
