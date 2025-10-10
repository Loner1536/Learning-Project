// Packages
import Network from "@shared/network";
import { Source } from "@rbxts/vide";

// Types
import type * as States from "@shared/types/network/states";
import type Core from "@shared/ecs/core";

type Sourceify<T> = {
	[K in keyof T]: Source<T[K]>;
};

export type PlayerData = Sourceify<States.Player.Data>;
export type WaveData = Sourceify<States.WaveData>;

type InterfaceProps = {
	sim: Core;

	playerData: PlayerData;
	waveData: WaveData;

	network: typeof Network;
};

export default InterfaceProps;
