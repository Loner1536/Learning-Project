// Packages
import Vide, { Source, source } from "@rbxts/vide";

export default function Button({ events }: { events: Vide.InstanceEventAttributes<TextButton> }) {
	return (
		<textbutton
			Name="Button"
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			{...events}
		/>
	);
}
