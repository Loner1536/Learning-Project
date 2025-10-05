// Packages
import { Entity } from "@rbxts/jecs";

// Components
import Wave from "./wave";

function Systems(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Wave: Wave(defineComponent),
	} as const;
}

export default Systems;
