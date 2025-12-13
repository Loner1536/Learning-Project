// Packages
import Vide, { source } from "@rbxts/vide";

// Utility
import mergeEventHandlers from "@shared/utils/mergeEventHandlers";

type ReactiveButtonProps = {
	properties?:
		| ((
				multi: Vide.Source<number>,
				hover: Vide.Source<boolean>,
				press: Vide.Source<boolean>,
		  ) => Partial<Vide.InstanceAttributes<Frame>>)
		| Partial<Vide.InstanceAttributes<Frame>>;

	reactive?: {
		motor?: Ripple.Motion<number>;

		hover?: Vide.Source<boolean>;
		press?: Vide.Source<boolean>;

		options?: {
			idle: number;
			hover: number;
			press: number;
		};
	};

	events?: Vide.InstanceEventCallbacks<TextButton>;
	children?: Vide.Node | Vide.Node[];
};

export function ReactiveButton({ properties, reactive, events, children }: ReactiveButtonProps) {
	const { idle = 1, hover = 1.1, press = 0.95 } = reactive?.options ?? {};
	const options = { idle, hover, press };

	const isHover = source(false);
	const isPress = source(false);

	const multi = source(options.idle);

	const isVisible = () => multi() !== 0;

	const defEvents: Vide.InstanceEventCallbacks<TextButton> = {
		MouseEnter: () => {
			if (!isVisible()) return;

			isHover(true);

			multi(options.hover);
		},
		MouseLeave: () => {
			if (!isVisible()) return;

			isHover(false);
			isPress(false);

			multi(options.idle);
		},
		MouseButton1Down: () => {
			if (!isVisible()) return;

			isPress(true);

			multi(options.press);
		},
		MouseButton1Up: () => {
			if (!isVisible()) return;

			isPress(false);

			multi(isHover() ? options.hover : options.idle);
		},
	};

	const button = (
		<textbutton
			Name={"Reactive Button"}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			{...mergeEventHandlers(defEvents, events ?? {})}
		>
			{children}
		</textbutton>
	);

	const resolvedProperties = typeIs(properties, "function")
		? properties(multi, isHover, isPress)
		: properties;

	return properties && resolvedProperties ? (
		<frame {...resolvedProperties}>{[resolvedProperties.children, children, button]}</frame>
	) : (
		button
	);
}
