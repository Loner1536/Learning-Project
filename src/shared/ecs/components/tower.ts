// Packages
import { Entity } from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

function Tower(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Id: defineComponent<string>("Tower/Id"),

		PlacementTime: defineComponent<number>("Tower/PlacementTime"),
		OwnerId: defineComponent<string>("Tower/OwnerId"),
	} as const;
}

export default Tower;
