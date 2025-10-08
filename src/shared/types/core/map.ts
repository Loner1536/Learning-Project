export type Type = "story";

export type Difficulty = "normal" | "nightmare";

export type WaveSpawn = {
	at: number; // seconds from wave start
	enemy: string; // template id
	count?: number; // default 1
	interval: number; // seconds between spawns when count > 1
	/** Optional route index (0-based). Defaults to 0 (primary route). */
	routeIndex?: number;
	/** Optional: mark this spawn group as boss regardless of template flag. */
	boss?: boolean;
};
export type Wave = {
	id: string;
	spawns: WaveSpawn[];
	reward?: number; // optional currency reward
	/** Optional: declarative that this wave contains a boss (for UI prompts). */
	bossWave?: boolean;

	routeIndex?: number;
};
export type Mission = {
	id: string;
	waves: Wave[];
	enemies: EnemyTemplate[];
};
export type EnemyTemplate = {
	id: string;
	health: number;
	speed: number; // tiles per second

	/** Optional marker so spawner can tag as Boss and UI can react. */
	boss?: boolean;
	/** Optional currency bounty for killing this enemy (server grants on death). */
	shield?: number;
	/** Optional incoming damage multiplier applied while shield > 0. Default 1. */
	shieldMultiplier?: number;
};
