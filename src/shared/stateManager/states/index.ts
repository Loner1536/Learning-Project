// Packages
import { atom } from "@rbxts/charm";

// Types
import type * as Types from "@shared/types";

const states = {
	players: atom<Map<string, Types.Network.States.PlayerData>>(new Map()),

	waveData: atom<Types.Network.States.WaveData>({
		id: "test",
		type: "story",
		hpStocks: 0,
		vote: false,
		enemies: 0,
		votes: 0,
		gameSpeed: 1,
		wave: 0,
		act: 0,
	}),
};

export default states;
