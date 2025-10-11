// Packages
import { RunService } from "@rbxts/services";

// Types
import type * as Types from "@shared/types";
import { type Entity } from "@rbxts/jecs";

// Modding
import { System, OnTick } from "@shared/modding/system";

@System("Enemy", "Movement")
export class Movement implements OnTick {
	onTick(e: Entity, core: Types.Core.API, dt: number) {
		const { world, C } = core;

		const query = world.query(C.Movement.RouteIndex, C.Movement.RoutePosIndex, C.Combat.Speed).with(C.Tags.Enemy);
		for (const [enemy, routeIndex, routePosIndex, speed] of query) {
			this.updateMovement(enemy, core, dt, routeIndex, routePosIndex, speed);
		}
	}

	private updateMovement(
		enemy: Entity,
		core: Types.Core.API,
		dt: number,
		routeIndex: number,
		node: number,
		speed: number,
	) {
		const { world, C, R, P, G } = core;

		if (P.nodes.size() === 0) {
			const route = R.getRoute(routeIndex);
			if (!route) return;
			P.setNodes(route.gridPositions);
		}

		const progress = world.get(enemy, C.Movement.Progress) ?? 0;

		const step = P.advance(node, progress, speed * dt);

		world.set(enemy, C.Movement.Progress, step.progress);
		world.set(enemy, C.Movement.RoutePosIndex, step.node);

		const gridPos = step.position;
		const route = R.getRoute(routeIndex);
		const nodeIdx = math.clamp(step.node, 0, (route?.positions.size() ?? 1) - 1);
		const worldY = route?.positions[nodeIdx]?.Y ?? 0;
		const worldPos = new Vector3(
			gridPos.X * G.tileSize + G.tileSize / 2,
			worldY,
			gridPos.Y * G.tileSize + G.tileSize / 2,
		);

		world.set(enemy, C.Movement.Grid, gridPos);
		world.set(enemy, C.Movement.World, worldPos);

		if (RunService.IsClient()) {
			const prevOrientation = world.get(enemy, C.Movement.Orientation) ?? new Vector3(0, 0, 1);
			const enemyPos = world.get(enemy, C.Movement.World) ?? worldPos;
			const targetDir = worldPos.sub(enemyPos).Unit;

			const smoothed = prevOrientation.Lerp(targetDir, math.clamp(dt * 10, 0, 1));
			world.set(enemy, C.Movement.Orientation, smoothed);
		}

		if (core.debug()) {
			const visualizer = world.get(enemy, C.Debug.Visualizer);
			if (visualizer && visualizer.IsA("BasePart")) {
				visualizer.Position = RunService.IsClient() ? worldPos : worldPos.add(new Vector3(0, 1, 0));
			}
		}

		if (step.reachedEnd) {
			world.add(enemy, C.Tags.Completed);
		}
	}
}
