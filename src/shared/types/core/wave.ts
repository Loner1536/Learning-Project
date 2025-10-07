// Types
import type * as Types from "@shared/types";

export type SpawnConfig = {
	health: number;
	speed: number;
	rate: number;
};
export type Emission = {
	time: number;
	enemy: string;
	routeIndex: number;
	boss?: boolean;
};
export type ActiveSpawn = {
	spawnConfig: Types.Core.Map.WaveSpawn;
	timer: number;
	remaining: number;
};
