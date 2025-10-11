// Packages
import { Service, OnInit } from "@flamework/core";
import Network from "@shared/network";

// Components
import replicator from "@server/replicator";
import getCore from "@shared/ecs";

@Service()
export default class JecsManager implements OnInit {
	public core = getCore();

	onInit() {
		Network.server.setCallback(Network.keys.jecs.receiveFull, Network.keys.jecs.receiveFullReturn, (player) => {
			replicator.mark_player_ready(player);

			const [buf, variants] = replicator.get_full(player);
			return [buf, variants];
		});

		const reliableInterval = this.core.interval(5);
		const unreliableInterval = this.core.interval(10);

		this.core.Scheduler.addSystem((core) => {
			if (reliableInterval()) {
				for (const [player, buf, variants] of replicator.collect_updates()) {
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
