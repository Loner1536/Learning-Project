// Types
import type { Entity, Id } from "@rbxts/jecs";
import type * as Types from "@shared/types";

// Utility
import EntitySharer from "./add_shared";
import EntityNamer from "./add_names";
import Schedulers from "./schedulers";
import Interval from "./interval";
import RefManager from "./ref";

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

	public observer<T extends unknown[]>(
		e: { [K in keyof T]: Entity<T[K]> },
		callback: (entity: Entity<T[number]>, id: Id<T[number]>, value: T[number]) => void,
	): void {
		if (typeIs(e, "table")) {
			for (const comp of e as Entity<T>[]) {
				this.sim.world.changed(comp, (entity, id, value) => callback(entity, id, value));
				this.sim.world.added(comp, (entity, id, value) => callback(entity, id, value));
			}
		} else {
			this.sim.world.changed(e as Entity<T>, (entity, id, value) => callback(entity, id, value));
			this.sim.world.added(e as Entity<T>, (entity, id, value) => callback(entity, id, value));
		}
	}

	public every(seconds: number) {
		const interval = new Interval(seconds);
		return () => interval.tick();
	}
}
