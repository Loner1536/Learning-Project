// Types
import type * as Types from "@shared/types";

export type Class = "ground" | "hill" | "hybrid";

export type Config = {
	id: string;
	range: number;
	damage: number;
	cooldown: number;
	class?: Class;
	targetMode?: Types.Core.Attack.TargetMode;
	attack?: { shape: Types.Core.Attack.Type; range?: number; width?: number; angle?: number };
};
export type TowerData = {
	// Core identity
	name: string;
	rarity: string;
	level: number;

	// Stats
	damage: number;
	range: number;
	speed: number;

	// Economy
	cost: number;
	sellValue: number;

	// Performance tracking
	kills: number;
	totalDamage: number;

	// Behavior
	targetMode: Types.Core.Attack.TargetMode;

	// Upgrade system
	upgradeLevels: { damage: number; range: number; speed: number };
	upgradeCosts: { damage: number; range: number; speed: number };
	maxLevels: { damage: number; range: number; speed: number };
	canUpgrade: boolean;
};
