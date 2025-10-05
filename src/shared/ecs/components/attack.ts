// Packages
import { Entity } from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

function Attack(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		TargetMode: defineComponent<Types.Core.Attack.TargetMode>("Attack/TargetMode"),
		Cooldown: defineComponent<Types.Core.Attack.Cooldown>("Attack/Cooldown"),
		Damage: defineComponent<number>("Attack/Damage"),
		Range: defineComponent<number>("Attack/Range"),

		Profile: defineComponent<Types.Core.Attack.Profile>("Attack/Profile"),
		Event: defineComponent<Types.Core.Attack.Event>("Attack/Event"),
	} as const;
}

export default Attack;
