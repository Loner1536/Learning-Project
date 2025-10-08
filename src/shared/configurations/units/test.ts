// Types
import type * as Types from "@shared/types";

const Test: Types.Configurations.Towers.Config = {
	name: "Test",
	displayName: "Test",

	rarity: "Test",
	category: "Test",

	released: true,
	tradable: false,
	sellable: true,
	placement: 3,
	radius: 2.5,

	element: "Test",
	terrain: "Ground",

	price: 1000,
	damage: 200,
	range: 30,
	spa: 1.5,

	attackSize: 3,
	attackType: "Full",

	passive: ["illusion"],

	animations: {
		idle: 1,
		walk: 2,
	},

	upgrades: [
		{
			price: 2000,
			damage: 500,
			range: 35,
		},
		{
			price: 2000,
			damage: 600,
			range: 45,
			attackSpeed: 1.3,
		},
	],

	criticalData: {
		chance: 0.1,
		multiplier: 2.5,
	},
};

export default [Test];
