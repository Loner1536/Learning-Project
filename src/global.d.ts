// Types
import type Types from "@shared/types";

declare global {
	type GroupNames = "Lobby" | "Gameplay";
	type AppNames = "BottomButtons" | "Inventory" | "InventoryInfo";
	type AppProps = {
		player: Player;

		core: Types.Core.API;
	};
}

export {};
