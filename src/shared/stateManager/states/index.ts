// Packages
import { atom } from "@rbxts/charm";

// Types
import type * as Types from "@shared/types";

const states = {
	players: atom<Map<string, Types.Network.States.Player.Data>>(new Map()),

	waveData: atom<Types.Network.States.WaveData>(),
};

export default states;
