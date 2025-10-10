// Packages
import { u8 } from "@rbxts/serio";

// Types
import { type Data as UnitData, WithConfig as UnitWithConfig } from "./units";

export * as Units from "./units";

export type Data = {
	gems: u8;

	team: string[];
	units: UnitData[];
};

export type WithConfigs = {
	gems: u8;

	team: string[];
	units: UnitWithConfig[];
};
