// Services
import { RunService } from "@rbxts/services";

// Packages
import { Modding, Reflect } from "@flamework/core";

// Types
import type * as Types from "@shared/types";

// Components
import getSim from "@shared/ecs";
import safePlayerAdded from "@shared/utility/safePlayerAdded";

const sim = getSim();

export interface OnTick {
	onTick(state: Types.Core.API): void;

	onPlayerAdded?(player: Player, state: Types.Core.API): void;

	onServerTick?(state: Types.Core.API): void;
	onClientTick?(state: Types.Core.API): void;
}

function addSystem<T>(jabbyId: string, category: string, callback: (...args: Types.Core.API[]) => void) {
	const { JabbyProfiler, Scheduler } = sim;

	Scheduler.addSystem((state) => {
		JabbyProfiler.Run(JabbyProfiler.EnsureSystem(jabbyId, category), () => callback(state));
	});
}

export const System = Modding.createDecorator<[string, string]>("Class", (descriptor, cfg) => {
	Reflect.defineMetadata(descriptor.object, "flamework:singleton", true);

	Modding.onListenerAdded((obj) => {
		if (obj instanceof descriptor.object) {
			if ("onTick" in obj) {
				const object = obj as OnTick;

				const name = cfg[1];
				const category = `${cfg[1]}.onTick`;

				addSystem(name, category, (state) => object.onTick(state));

				if ("onPlayerAdded") {
					safePlayerAdded((player) => object.onPlayerAdded!(player, sim));
				}

				if ("onServerTick" in obj && RunService.IsServer()) {
					addSystem(`${name}.Server`, category, (state) => object.onServerTick!(state));
				}

				if ("onClientTick" in obj && RunService.IsClient()) {
					addSystem(`${name}.Client`, category, (state) => object.onClientTick!(state));
				}
			}
		}
	});
});
