// Packages
import { Service, OnStart } from "@flamework/core";
import Network from "@shared/network";

// Types
import type Systems from "@shared/ecs/systems";
import type Components from "@shared/ecs/components";
import { type World } from "@rbxts/jecs";

// Dependencies
import JecsManager from "../jecsManager";

@Service({})
export default class NetworkManager implements OnStart {
	private world: World;

	private C: Components;
	private S: Systems;

	constructor(private jecManager: JecsManager) {
		this.world = this.jecManager.sim.world;

		this.C = this.jecManager.sim.C;
		this.S = this.jecManager.sim.S;
	}

	onStart() {
		this.setupNetworks();
	}

	private setupNetworks() {
		this.Wave(this.world, this.C, this.S);
	}

	private Wave(world: World, C: Components, S: Systems) {
		Network.server.on(Network.keys.wave.vote, (player: Player) => S.Wave.vote(player));

		Network.server.on(Network.keys.wave.gameSpeed, (player: Player, speed: number) => {
			S.Wave.speed(player, speed);
		});
	}
}
