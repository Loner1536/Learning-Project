// Packages
import { Service, OnInit } from "@flamework/core";
import Network from "@shared/network";

// Components
import replicator from "@server/replicator";
import getSim from "@shared/ecs";

@Service()
export default class JecsManager implements OnInit {
	public sim = getSim();

	onInit() {
		Network.server.setCallback(Network.keys.jecs.receiveFull, Network.keys.jecs.receiveFullReturn, (player) => {
			replicator.mark_player_ready(player);

			const [buf, variants] = replicator.get_full(player);
			return [buf, variants];
		});

		// TODO: New Scheduler integration

		// const reliableInterval = this.sim.U.every(1 / 20);
		// const unreliableInterval = this.sim.U.every(1 / 30);

		// this.sim.U.Scheduler.System(() => {
		// 	if (reliableInterval()) {
		// 		for (const [player, buf, variants] of replicator.collect_updates()) {
		// 			Network.client.emit(player, Network.keys.jecs.sendUpdates, [buf, variants]);
		// 		}
		// 	}
		// 	if (unreliableInterval()) {
		// 		for (const [player, buf, variants] of replicator.collect_unreliable()) {
		// 			Network.client.emit(player, Network.keys.jecs.sendUpdates, [buf, variants], true);
		// 		}
		// 	}
		// });
	}
}
