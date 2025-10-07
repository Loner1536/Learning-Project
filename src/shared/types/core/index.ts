// Packages
import { Entity } from "@rbxts/jecs";

// Types
import type Core from "@shared/ecs/core";

import type * as Attack from "./attack";
import type * as Tower from "./tower";
import type * as Party from "./party";
import type * as Route from "./route";
import type * as Grid from "./grid";
import type * as Wave from "./wave";
import type * as Map from "./map";

export type Options = {
	grid: Grid.Config;
	path: Vector2[];
	spawn: Wave.SpawnConfig;
	onTowerReimbursed?: (tower: Entity, amount: number) => void;
};

export type API = Core;

export type * as Attack from "./attack";
export type * as Tower from "./tower";
export type * as Party from "./party";
export type * as Route from "./route";
export type * as Grid from "./grid";
export type * as Wave from "./wave";
export type * as Map from "./map";
