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
		this.world = this.jecManager.sim.world;

		this.C = this.jecManager.sim.C;
	}

	onStart() {
		this.setupNetworks();
	}

	private setupNetworks() {}

	private Wave(world: World, C: Components) {}
	private Tower(world: World, C: Components) {}
}
