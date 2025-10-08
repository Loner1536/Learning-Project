// Packages
import { u8 } from "@rbxts/serio";

// Types
import type { Unit } from "./units";

export type PlayerData = {
	gems: u8;

	team: string[];
	units: Unit[];
};
