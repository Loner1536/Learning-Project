// Packages
import Object, { copy } from "@rbxts/object-utils";

// Types
import type * as Types from "@shared/types";

// Utility
import EntitySharer from "./add_shared";
import EntityNamer from "./add_names";
import Schedulers from "./schedulers";
import Interval from "./interval";
import RefManager from "./ref";
import { Entity, Id } from "@rbxts/jecs";

export default class Utility {
	public Scheduler: Schedulers;
	public Sharer: EntitySharer;
	public Namer: EntityNamer;
	public Refs: RefManager;

	constructor(public sim: Types.Core.API) {
		this.Scheduler = new Schedulers(this.sim);
		this.Sharer = new EntitySharer(this.sim);
		this.Namer = new EntityNamer(this.sim);
		this.Refs = new RefManager(this.sim);
	}

	public observer<T>(e: Entity<T> | Entity<T>[], callback: (entity: Entity, id: Id<T>, value: T) => void) {
		if (typeIs(e, "table")) {
			for (const comp of e as Entity<T>[]) {
				this.sim.world.changed(comp, (entity, id, value) => {
					callback(entity, id, value);
				});
			}
		} else {
			this.sim.world.changed(e as Entity<T>, (entity, id, value) => callback(entity, id, value));
		}
	}

	public interval(seconds: number) {
		const interval = new Interval(seconds);
		return () => interval.tick();
	}
}
