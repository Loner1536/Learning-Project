// Packages
import { u8, u32 } from "@rbxts/serio";

// Types
import { Traits } from "../../../configurations";

// Configurations
import unitConfigurations from "@shared/configurations/units";

type UnitsIds = keyof typeof unitConfigurations;

export type Unit = {
	id: UnitsIds;
	uuid: string;
	obtainedAt: u32;
	trait?: Traits;

	traitData?: {
		trait: Traits;
		time: u32;
	}[];

	evo: u8;
	shiny: boolean;
	locked: boolean;
	favorited: boolean;

	level: {
		value: u32;
		current: u32;
	};
	potential: {
		damage: u32;
		range: u32;
		spa: u32;
	};
};
