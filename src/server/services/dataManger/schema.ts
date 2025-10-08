// Packages
import Object from "@rbxts/object-utils";
import { t } from "@rbxts/t";

// Configurations
import unitConfigurations from "@shared/configurations/units";

const literalKeys = <T extends Record<string, unknown>>(obj: T) =>
	t.union(...(Object.keys(obj) as (keyof T)[]).map((key) => t.literal(key)));

const Trait = t.literal("Test");

const Unit = t.interface({
	id: literalKeys(unitConfigurations),
	uuid: t.string,
	obtainedAt: t.number,

	trait: t.optional(Trait),

	traitData: t.optional(
		t.array(
			t.interface({
				trait: Trait,
				time: t.number,
			}),
		),
	),

	evo: t.number,
	shiny: t.boolean,
	locked: t.boolean,
	favorited: t.boolean,

	level: t.interface({
		value: t.number,
		current: t.number,
	}),
	potential: t.interface({
		damage: t.number,
		range: t.number,
		spa: t.number,
	}),
});

export default t.interface({
	gems: t.number,

	units: t.array(Unit),
	team: t.array(t.string),
});
