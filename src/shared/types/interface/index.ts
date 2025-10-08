// Packages
import Network from "@shared/network";
import { Source } from "@rbxts/vide";

// Types
import type * as States from "@shared/types/network/states";
import type Core from "@shared/ecs/core";

type Sourceify<T> = {
	[K in keyof T]: Source<T[K]>;
};

export type PlayerData = Sourceify<States.PlayerData>;
export type WaveData = Sourceify<States.WaveData>;

export type TopMenu = {
	visible: Source<boolean>;
};

type InterfaceProps = {
	sim: Core;

	playerData: PlayerData;
	waveData: WaveData;

	network: typeof Network;

	topMenu: TopMenu;
};

export default InterfaceProps;
