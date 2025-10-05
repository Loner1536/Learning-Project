// Packages
import { Entity } from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

function Wave(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Mission: defineComponent<Types.Core.Map.Mission>("System/Wave/Mission"),
		Enemies: defineComponent<Types.Core.Map.EnemyTemplate[]>("System/Wave/Enemies"),

		ActiveRoute: defineComponent<Types.Core.Route.Info>("System/Wave/ActiveRoute"),
		Routes: defineComponent<Types.Core.Route.Info[]>("System/Wave/Routes"),
		GameSpeed: defineComponent<number>("System/Wave/GameSpeed"),

		HpStocks: defineComponent<number>("System/Wave/HpStocks"),
	} as const;
}

export default Wave;
