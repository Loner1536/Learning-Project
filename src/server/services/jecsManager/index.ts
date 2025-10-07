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
		Network.server.on(Network.keys.jecs.receiveFull, (player) => {
			replicator.mark_player_ready(player);

			const [buf, variants] = replicator.get_full(player);
			return [buf, variants];
		});

		const reliableInterval = this.sim.U.every(1 / 20);
		const unreliableInterval = this.sim.U.every(1 / 30);

		this.sim.U.Scheduler.System(() => {
			if (reliableInterval()) {
				for (const [player, buf, variants] of replicator.collect_updates()) {
					print("sending reliable update to", player.Name, buf, variants);
					Network.client.emit(player, Network.keys.jecs.sendUpdates, [buf, variants]);
				}
			}
			if (unreliableInterval()) {
				for (const [player, buf, variants] of replicator.collect_unreliable()) {
					Network.client.emit(player, Network.keys.jecs.sendUpdates, [buf, variants], true);
				}
			}
		});
	}
}
