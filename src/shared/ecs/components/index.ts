// Packages
import { Shared } from "@rbxts/replecs";
import { Name } from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

// Components
import Vectors from "./vectors";
import Systems from "./systems";
import Attack from "./attack";
import Tower from "./tower";
import Enemy from "./enemy";
import Debug from "./debug";
import Tags from "./tags";

export default class Components {
	constructor(private sim: Types.Core.API) {}

	public Tags = Tags((name) => this.defineTag(name));

	public Vectors = Vectors((name) => this.defineComponent(name));
	public Systems = Systems((name) => this.defineComponent(name));
	public Attack = Attack((name) => this.defineComponent(name));
	public Enemy = Enemy((name) => this.defineComponent(name));
	public Tower = Tower((name) => this.defineComponent(name));

	public Debug = Debug((name) => this.defineComponent(name));

	// --- Helpers ---
	private defineComponent<T>(name: string) {
		const comp = this.sim.world.component<T>();
		this.sim.world.set(comp, Name, name);
		this.sim.world.add(comp, Shared);
		return comp;
	}

	private defineTag(name: string) {
		const tag = this.sim.world.entity();
		this.sim.world.set(tag, Name, name);
		this.sim.world.add(tag, Shared);
		return tag;
	}
}
