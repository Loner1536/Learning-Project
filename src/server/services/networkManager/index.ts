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
		this.Tower(this.world, this.C, this.S);
	}

	private Wave(world: World, C: Components, S: Systems) {
		Network.server.setCallback(Network.keys.wave.vote, Network.keys.wave.voteReturn, (player: Player) => {
			return S.Wave.vote(player);
		});

		Network.server.setCallback(
			Network.keys.wave.gameSpeed,
			Network.keys.wave.gameSpeedReturn,
			(player: Player, speed: number) => {
				return S.Wave.speed(player, speed);
			},
		);
	}

	private Tower(world: World, C: Components, S: Systems) {
		Network.server.setCallback(
			Network.keys.towers.placement,
			Network.keys.towers.placementReturn,
			(player, data) => {
				const [index, rotation] = data;

				return S.Tower.place(player, index, rotation);
			},
		);
	}
}
