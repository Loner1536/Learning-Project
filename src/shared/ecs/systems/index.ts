// Types
import type * as Types from "@shared/types";

// Systems
import EnemySystem from "./enemy";
import TowerSystem from "./tower";
import WaveSystem from "./wave";

export default class Systems {
	public Enemy: EnemySystem;
	public Tower: TowerSystem;
	public Wave: WaveSystem;

	constructor(sim: Types.Core.API) {
		this.Enemy = new EnemySystem(sim);
		this.Tower = new TowerSystem(sim);
		this.Wave = new WaveSystem(sim);
	}
}
