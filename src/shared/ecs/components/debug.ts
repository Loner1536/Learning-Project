// Packages
import { Entity } from "@rbxts/jecs";

function Debug(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Visual: defineComponent<BasePart>("Debug/Visual"),
	} as const;
}

export default Debug;
