// Packages
import type * as Types from "@shared/types";

const defaultData = {
	gems: 0,

	units: [
		{
			id: "Itadori",
			uuid: "unit-1",

			obtainedAt: 123123123,

			trait: "Test",
			traitData: [{ trait: "Test", time: 123123123 }],

			evo: 0,

			shiny: false,

			locked: false,
			favorited: false,

			level: {
				value: 1,
				current: 0,
			},
			potential: {
				damage: 1.1,
				range: 1.1,
				spa: 1.1,
			},
		},
	],
	team: ["unit-1", "", "", "", "", ""],
} satisfies Types.Network.States.Player.Data;

export default defaultData;
