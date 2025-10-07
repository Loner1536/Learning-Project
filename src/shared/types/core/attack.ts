// Types
import type { Entity } from "@rbxts/jecs";

export type Profile = {
	shape: Type;
	range?: number;
	width?: number;
	angle?: number;
};
export type TargetMode = "first" | "last" | "strongest" | "weakest" | "closest" | "farthest" | "air";
export type Event = { target?: Entity; targets?: Entity[]; name?: string };
export type Cooldown = { current: number; max: number };
export type Type = "circle" | "line" | "cone" | "full";
