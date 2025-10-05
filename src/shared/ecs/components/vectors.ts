// Packages
import { Entity } from "@rbxts/jecs";

function Vectors(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Orientation: defineComponent<Vector3>("Vectors/Orientation"),
		MoveDir: defineComponent<Vector2>("Vectors/MoveDir"),
		World: defineComponent<Vector3>("Vectors/WorldPos"),
		Grid: defineComponent<Vector2>("Vectors/GridPos"),
	} as const;
}

export default Vectors;
