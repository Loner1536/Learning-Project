// Packages
import { Entity } from "@rbxts/jecs";

// Types
import type Components from "@shared/ecs/components";
import type Core from "@shared/ecs/core";

export type API = Core;
export type { Components };

export type GridConfig = {
	width: number;
	height: number;
	tileSize?: number;
};

export namespace GameState {
	export type Type = "story";
	export type Difficulty = "normal" | "nightmare";

	export type SpawnConfig = {
		at: number;
		enemy: string;
		count?: number;
		interval: number;
		routeIndex?: number;
		boss?: boolean;
	};
	export type ActiveSpawn = {
		spawnConfig: SpawnConfig;
		timer: number;
		remaining: number;
	};
	export type Wave = {
		id: string;
		spawns: SpawnConfig[];
		reward?: number;
		bossWave?: boolean;

		routeIndex?: number;
	};
	export type Mission = {
		id: string;
		waves: Wave[];
		enemies: EnemyConfig[];
	};
	export type EnemyConfig = {
		id: string;
		health: number;
		speed: number;
		boss?: boolean;
		shield?: number;
		shieldMultiplier?: number;
	};
}

export namespace Player {
	export type TeleportData = {
		id: string;
		type: GameState.Type;
		difficulty: GameState.Difficulty;
	};
}

export namespace Route {
	export type BuilderConfig = {
		grid: {
			width: number;
			height: number;
			tileSize: number;
		};
	};
	export type Info = {
		name: string;
		path: Vector3[];
		models: DefinedModel[];
	};
	export type DefinedModel = Model & {
		Parent: Folder;
		Start: BasePart;
		End: BasePart;
	};
}
export namespace Combat {
	export type TargetMode = "first" | "last" | "strongest" | "weakest" | "closest" | "farthest" | "air";
	export type Event = { target?: Entity; targets?: Entity[]; name?: string };
	export type Cooldown = { current: number; max: number };
	export type Type = "circle" | "line" | "cone" | "full";

	export type Profile = {
		shape: Type;
		range?: number;
		width?: number;
		angle?: number;
	};
}
