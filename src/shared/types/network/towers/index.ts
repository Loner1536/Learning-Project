// Packages
import { u8, u16, f32, Tuple, Vector } from "@rbxts/serio";

export type Placement = Tuple<[u8, u16, Vector<f32, f32, f32>]>;

export type PlacementReturn = Tuple<
	[
		boolean,
		(
			| "Cost"
			| "Invalid Placement"
			| "Max Placement"
			| "No Unit Found"
			| "No Player Data"
			| "No Model Found"
			| "Max Placement"
			| "Empty Team"
			| "Placed"
			| "Valid"
		),
	]
>;
