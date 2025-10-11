// Packages
import { Service, OnStart } from "@flamework/core";
import Network from "@shared/network";

// Types
import type Components from "@shared/ecs/components";
import { type World } from "@rbxts/jecs";

// Dependencies
import JecsManager from "../jecsManager";

@Service({})
export default class NetworkManager implements OnStart {
	private world: World;

	private C: Components;

	constructor(private jecManager: JecsManager) {
		this.world = this.jecManager.core.world;

		this.C = this.jecManager.core.C;
	}

	onStart() {
		this.setupNetworks();
	}

	private setupNetworks() {
		this.Wave(this.world, this.C);
	}

	private Wave(world: World, C: Components) {
		Network.server.setCallback(Network.keys.wave.vote, Network.keys.wave.voteReturn, (player: Player) => {
			for (const [e, userId] of world.query(C.Player.UserId).with(C.Tags.Player)) {
				if (player.UserId === userId && !world.get(e, C.Player.Voted)) {
					world.set(e, C.Player.Voted, true);
					return true;
				}
			}

			return false;
		});
	}
	private Tower(world: World, C: Components) {}
}
