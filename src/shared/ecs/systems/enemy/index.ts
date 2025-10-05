// Services
import { RunService } from "@rbxts/services";

// Packages
import type { Entity, CachedQuery, Tag } from "@rbxts/jecs";

// Types
import type * as Types from "@shared/types";

// Components
import Path from "./path";

export default class EnemySystem {
	public Path: Path;

	constructor(private sim: Types.Core.API) {
		this.Path = new Path();

		this.sim.U.Scheduler.System((...args) => {
			const dt = args[0] as number;

			this.sim.P.Run(this.sim.P.EnsureSystem("EnemySystem", "Update"), () => this.tick(dt));
		});
	}

	public tick(dt: number) {
		const systemCached = this.sim.cachedQueries.systems;
		const enemyCached = this.sim.cachedQueries.enemies;

		let routes: Types.Core.Route.Info[] | undefined;

		for (const [e] of systemCached.iter()) {
			const r = this.sim.world.get(e, this.sim.C.Systems.Wave.Routes);
			if (r) {
				routes = r;
				break;
			}
		}

		for (const e of enemyCached.iter()) {
		}

		if (!routes || routes.size() === 0) return;

		for (const [e] of enemyCached.iter()) {
			const speed = this.sim.world.get(e, this.sim.C.Enemy.Speed) ?? 0;
			if (speed <= 0) continue;

			const pathProg = this.sim.world.get(e, this.sim.C.Enemy.PathProgress);
			if (!pathProg) continue;

			const routeIndex = this.sim.world.get(e, this.sim.C.Enemy.PathIndex) ?? 1;
			const route = routes[math.clamp(routeIndex - 1, 0, routes.size() - 1)];

			if (!route || route.models.size() < 2) continue;

			const distance = speed * dt;

			const routePositions = route.path;
			const step = this.Path.advance(routePositions, pathProg.node, pathProg.progress, distance);

			const worldPos = step.position;
			this.sim.world.set(e, this.sim.C.Vectors.World, worldPos);
			this.sim.world.set(e, this.sim.C.Vectors.Grid, new Vector2(worldPos.X, worldPos.Z));
			this.sim.world.set(e, this.sim.C.Enemy.PathProgress, { node: step.node, progress: step.progress });

			this.updateSimpleOrientation(e, step.node, route.path);

			if (step.reachedEnd) {
				this.handleEnemyDeath(e);
				continue;
			}

			if (this.sim.debug) {
				const debugPart = this.sim.world.get(e, this.sim.C.Debug.Visual) as BasePart | undefined;
				if (debugPart) {
					debugPart.CFrame = CFrame.lookAt(
						worldPos,
						worldPos.add(this.sim.world.get(e, this.sim.C.Vectors.Orientation) ?? new Vector3(1, 0, 0)),
					);
				}
			}
		}
	}

	private handleEnemyDeath(e: Entity) {
		const hpOnDeath = this.sim.world.get(e, this.sim.C.Enemy.Health);
		if (!hpOnDeath) return;

		this.sim.world.set(e, this.sim.C.Enemy.Health, 0);
		this.sim.world.add(e, this.sim.C.Tags.Completed);
		this.sim.world.add(e, this.sim.C.Tags.Dead);

		if (RunService.IsServer()) {
			if (this.sim.debug) this.sim.world.get(e, this.sim.C.Debug.Visual)?.Destroy();
			this.sim.world.delete(e);
		}
	}

	public updateSimpleOrientation(e: Entity, node: number, path: Vector3[]) {
		const endIdx = math.max(0, path.size() - 1);
		const i = math.clamp(node, 0, math.max(0, endIdx - 1));
		const a = path[i];
		const b = path[i + 1] ?? a;
		const dir = b.sub(a);

		if (dir.Magnitude > 1e-6) {
			this.sim.world.set(e, this.sim.C.Vectors.Orientation, dir.Unit);
		}
	}

	public reconcilePredicted() {
		for (const [e] of this.sim.world.query(this.sim.C.Enemy.PredictedHealth)) {
			if (!this.sim.world.has(e, this.sim.C.Tags.Predicted) && this.sim.world.has(e, this.sim.C.Enemy.Health)) {
				this.sim.world.remove(e, this.sim.C.Enemy.PredictedHealth);
			}
		}
	}

	public cleanupDead() {
		for (const [e] of this.sim.world.query(this.sim.C.Tags.Dead).with(this.sim.C.Tags.Enemy)) {
			const health = (this.sim.world.get(e, this.sim.C.Enemy.Health) as number) ?? 0;
			const isPredicted = this.sim.world.has(e, this.sim.C.Tags.Predicted);
			if (health <= 0 && !isPredicted) this.sim.world.delete(e);
		}
	}
}
