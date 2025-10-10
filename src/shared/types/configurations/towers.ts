// Types
import type { Rarities } from "./rarities";
import type { Unit } from "./categories";

export namespace Types {
	export type Elements = "Test";

	export type Terrain = "Ground" | "Hill" | "Hybrid";

	export type Attack = "Circle" | "Line" | "Cone" | "Full";
}

export type Config = {
	name: string;
	displayName: string;

	rarity: Rarities;
	category: Unit;
	released?: boolean;
	limited?: boolean;
	tradable?: boolean;
	sellable?: boolean;
	placement: number;
	radius: number;

	maxPlacement: number;
	skin?: string;

	element: Types.Elements;
	terrain: Types.Terrain;

	price: number;
	damage?: number;
	money?: number;
	range: number;
	spa: number;
	attackSize: number;
	attackEffects?: string[];
	attackType: Types.Attack;

	passive: string[];

	animations: {
		idle: number;
		walk: number;
	};

	upgrades: Array<{
		price: number;
		damage?: number;
		money?: number;
		range?: number;
		attackSpeed?: number;
		terrain?: Types.Terrain;
		newAbility?: {
			name: string;
			attackSize: number;
			attackEffects?: string[];
			attackType: Types.Attack;
		};
	}>;

	evoData?: {
		unit: Config;
		display: string[];
		requirements: Array<Config>; // TODO: Add Item data here in the future
	};

	criticalData: {
		chance: number;
		multiplier: number;
	};
};
