// Types
import type Types from "@shared/types";

declare global {
	type GroupNames = "Lobby" | "Gameplay" | "Window";
	type AppNames = "BottomButtons" | "Inventory" | "InventoryInfo" | "Settings";
	type AppProps = {
		player: Player;

		core: Types.Core.API;
	};
}

export {};
