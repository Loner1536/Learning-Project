// Packages
import { u8, u16, Tuple } from "@rbxts/serio";

export type Placement = Tuple<[u8, u16]>;

export type PlacementReturn = Tuple<[boolean, "Cost" | "Invalid" | "Max Placement" | "Valid"]>;
