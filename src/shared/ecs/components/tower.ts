// Packages
import { Entity } from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

function Tower(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Model: defineComponent<Model>("Tower/Model"),
		SelectionBox: defineComponent<Instance>("Tower/SelectionBox"),

		Id: defineComponent<string>("Tower/Id"),
		UUID: defineComponent<string>("Tower/UUID"),

		PlacementTime: defineComponent<number>("Tower/PlacementTime"),
		OwnerId: defineComponent<string>("Tower/OwnerId"),

		Upgrade: defineComponent<number>("Tower/Upgrade"),
	} as const;
}

export default Tower;
