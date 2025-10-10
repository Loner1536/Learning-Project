// Packages
import { type u8, type u32 } from "@rbxts/serio";

// Types
import { type Config } from "@shared/types/configurations/towers";
import { type Traits } from "../../../configurations";

// Configurations
import unitConfigurations from "@shared/configurations/units";

type UnitsIds = keyof typeof unitConfigurations;

export type Data = {
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

export type WithConfig = Data & Config;
