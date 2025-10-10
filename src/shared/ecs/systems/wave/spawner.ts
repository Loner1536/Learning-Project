// Types
import type * as Types from "@shared/types";

// Modding
import { System, OnTick } from "@shared/modding/system";

@System("Wave", "Spawner")
export class Spawner implements OnTick {
	onTick(state: Types.Core.API): void {
		const { world, C } = state;
	}

	onPlayerAdded(player: Player, state: Types.Core.API): void {
		const { world, C } = state;
	}

	onServerTick(state: Types.Core.API): void {
		const { world, C } = state;
	}
	onClientTick(state: Types.Core.API): void {
		const { world, C } = state;
	}
}
