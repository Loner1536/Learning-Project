// Packages
import Replecs from "@rbxts/replecs";

// Types
import type * as Types from "@shared/types";

let replicator: Replecs.ReplecsLib;

export default function getReplicator(sim: Types.Core.API) {
	if (!replicator) {
		replicator = Replecs.create(sim.world);
	}

	return replicator;
}
