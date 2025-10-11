// Services
import { RunService, Players } from "@rbxts/services";

// Packages
import { Modding, Reflect } from "@flamework/core";

// Types
import type * as Types from "@shared/types";
import { type Entity } from "@rbxts/jecs";

// Utility
import safePlayerAdded from "@shared/utility/safePlayerAdded";

// Components
import getCore from "@shared/ecs";

const core = getCore();

export interface OnTick {
	onTick?(e: Entity, core: Types.Core.API, dt: number): void;

	onPlayerAdded?(player: Player, e: Entity, core: Types.Core.API): void;
	onPlayerRemoving?(player: Player, e: Entity, core: Types.Core.API): void;

	onServerTick?(e: Entity, core: Types.Core.API, dt: number): void;
	onClientTick?(e: Entity, core: Types.Core.API, dt: number): void;
}

function addSystem<T>(jabbyId: string, category: string, callback: (core: Types.Core.API, dt: number) => void) {
	const { JabbyProfiler, Scheduler } = core;

	Scheduler.addSystem((core) => {
		const dt = Scheduler.getDeltaTime();

		JabbyProfiler.Run(JabbyProfiler.EnsureSystem(jabbyId, category), () => callback(core, dt));
	});
}

let system = core.world.entity();

export const System = Modding.createDecorator<[string, string]>("Class", (descriptor, cfg) => {
	Reflect.defineMetadata(descriptor.object, "flamework:singleton", true);

	Modding.onListenerAdded((obj) => {
		if (obj instanceof descriptor.object) {
			const name = cfg[1];
			const category = `${cfg[0]}.onTick`;

			const object = obj as OnTick;

			// Player Added
			if ("onPlayerAdded" in object) {
				safePlayerAdded((player) => object.onPlayerAdded!(player, system, core));
			}

			// Player Removing
			if ("onPlayerRemoving" in object) {
				Players.PlayerRemoving.Connect((player) => object.onPlayerRemoving!(player, system, core));
			}

			// HeartBeat
			if ("onTick" in object) {
				addSystem(name, category, (state, dt) => object.onTick!(system, state, dt));
			}

			if ("onServerTick" in object && RunService.IsServer()) {
				addSystem(`${name}.Server`, category, (core, dt) => object.onServerTick!(system, core, dt));
			}

			if ("onClientTick" in object && RunService.IsClient()) {
				addSystem(`${name}.Client`, category, (core, dt) => object.onClientTick!(system, core, dt));
			}
		}
	});
});
