// Services
import { RunService } from "@rbxts/services";

// Packages
import type { Entity } from "@rbxts/jecs";

// Types
import type * as Types from "@shared/types";

// Classes
import Path from "./path";

export default class EnemySystem {
	public Entity: Entity;

	private Path: Path;

	constructor(private sim: Types.Core.API) {
		this.Entity = this.sim.world.entity();
		this.sim.world.add(this.Entity, this.sim.C.Tags.System);

		this.Path = new Path();
	}

	// Helpers
	private handleEnemyDeath(e: Entity) {
		const hpOnDeath = this.sim.world.get(e, this.sim.C.Enemy.Health);
		if (!hpOnDeath) return;

		this.sim.world.set(e, this.sim.C.Enemy.Health, 0);
		this.sim.world.add(e, this.sim.C.Tags.Completed);
		this.sim.world.add(e, this.sim.C.Tags.Dead);

		if (RunService.IsServer()) {
			if (this.sim.debug()) this.sim.world.get(e, this.sim.C.Debug.Visual)?.Destroy();
			this.sim.world.delete(e);
		}
	}
	private handleMovement(dt: number, e: Entity, targetPos: Vector3) {
		let orientation = this.sim.world.get(e, this.sim.C.Vectors.Orientation) ?? new Vector3(1, 0, 0);

		const groundOffset = new CFrame(0, 1, 0);
		const targetCFrame = CFrame.lookAt(targetPos, targetPos.add(orientation));

		if (this.sim.debug()) {
			const debugPart = this.sim.world.get(e, this.sim.C.Debug.Visual);
			if (debugPart) {
				debugPart.PivotTo(RunService.IsServer() ? targetCFrame : targetCFrame.mul(groundOffset));
			}
		}

		if (RunService.IsClient()) {
			const prevCFrame = this.sim.world.get(e, this.sim.C.Enemy.RenderedCFrame) ?? targetCFrame;
			const model = this.sim.world.get(e, this.sim.C.Enemy.Model) as Model;
			if (!model) return;

			const speed = this.sim.world.get(e, this.sim.C.Enemy.Speed) ?? 0;

			const lerpFactor = math.clamp(dt * speed, 0, 1);

			const desiredCFrame = CFrame.lookAt(prevCFrame.Position.Lerp(targetPos, lerpFactor), targetPos);

			model.PivotTo(desiredCFrame.mul(groundOffset));

			this.sim.world.set(e, this.sim.C.Enemy.RenderedCFrame, desiredCFrame);
		}
	}

	// Actions
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

	// Core
	public tick(dt: number) {
		for (const [e] of this.sim.cachedQueries.enemies.iter()) {
			const routes = this.sim.world.get(this.sim.S.Wave.Entity, this.sim.C.Systems.Wave.Routes);
			if (!routes) continue;

			const speed = this.sim.world.get(e, this.sim.C.Enemy.Speed) ?? 0;
			if (speed <= 0) continue;

			const pathProg = this.sim.world.get(e, this.sim.C.Enemy.PathProgress);
			if (!pathProg) continue;

			const routeIndex = this.sim.world.get(e, this.sim.C.Enemy.PathIndex) ?? 0;
			const route = routes[math.clamp(routeIndex, 0, routes.size() - 1)];
			if (!route || route.path.size() < 2) continue;

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

			this.handleMovement(dt, e, worldPos);
		}
	}
}
