// Services
import { Service, OnStart } from "@flamework/core";
import Network from "@shared/network";

// Components
import replicator from "@client/replicator";
import getSim from "@shared/ecs";

@Service()
export default class JecsManager implements OnStart {
	public sim = getSim();

	// TODO: Find out how to serialize
	onStart() {
		Network.server.invoke(Network.keys.jecs.receiveFull, Network.keys.jecs.receiveFullReturn).then((data) => {
			if (!data) return;

			const [buf, variants] = data;
			replicator.apply_full(buf, variants);
		});

		Network.client.on(Network.keys.jecs.sendUpdates, (data) => {
			if (!data) return;

			const [buf, variants] = data;
			replicator.apply_updates(buf, variants);
		});
	}
}
