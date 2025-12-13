// Types
import type Types from "@shared/types";

declare global {
	type GroupNames = "";
	type AppNames = "BottomButtons" | "Inventory";
	type AppProps = {
		player: Player;

		core: Types.Core.API;
	};
}

export {};
