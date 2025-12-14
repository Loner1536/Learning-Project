// Packages
import { useDebounceCallback, useSpring } from "@rbxts/loners-pretty-vide-utils";
import { useVideAppContext } from "@rbxts/app-forge";
import Vide, { source, effect } from "@rbxts/vide";

// Components
import { ReactiveButton } from "../../components/button";

type ButtonProps = {
	selected?: Vide.Source<boolean>;
	order?: number;

	delayOut?: number;
	delayIn?: number;

	onRelease?: () => void;
};

export default function CategoryButton({
	selected,
	order = 1,
	delayOut = 0,
	delayIn = 0,
	onRelease,
}: ButtonProps) {
	const { px } = useVideAppContext();

	const transparency = source(selected && selected() ? 1 : 0);

	const visible = source(false);
	const hideDebounced = useDebounceCallback(
		() => {
			visible(false);
		},
		{ wait: 0.1 },
	);

	return (
		<ReactiveButton
			properties={(multi) => {
				effect(() => {
					const shouldBeVisible = multi() > 0;

					if (shouldBeVisible) {
						hideDebounced.cancel();
						visible(true);
					} else {
						hideDebounced.run();
					}
				});

				if (selected) {
					multi(0); // Starts at 0

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
					BackgroundTransparency: useSpring(transparency, { frequency: 0.25, damping: 0.5 }),
					Size: useSpring(() => UDim2.fromOffset(px(100 * multi()), px(100 * multi())), {
						frequency: 0.25,
						damping: 0.5,
					}),
					Visible: visible,
					LayoutOrder: order,
				};
			}}
			events={{
				MouseButton1Up: () => onRelease?.(),
			}}
		>
			<uicorner CornerRadius={() => new UDim(0, px(20))} />
		</ReactiveButton>
	);
}
