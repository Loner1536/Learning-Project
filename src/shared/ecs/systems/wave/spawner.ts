// Types
import { pair, type Entity } from "@rbxts/jecs";
import type * as Types from "@shared/types";

// Modding
import { System, OnTick } from "@shared/modding/system";
import { RunService, Workspace } from "@rbxts/services";
import { networked, reliable } from "@rbxts/replecs";

@System("Wave", "Spawner")
export class Spawner implements OnTick {
	onTick(e: Entity, core: Types.Core.API, dt: number): void {
		const { world, C, R } = core;
		const isClient = RunService.IsClient();

		if (!R.getRoute(1)) return;

		for (const [_, activeSpawns, enemies] of world.query(C.GameState.ActiveSpawns, C.GameState.Enemies)) {
			if (!activeSpawns) continue;

			for (const spawn of activeSpawns) {
				spawn.timer -= dt;

				if (spawn.timer <= 0 && spawn.remaining > 0) {
					const enemyTemplate = enemies.find((enemy) => enemy.id === spawn.spawnConfig.enemy);
					if (!enemyTemplate) error(`No enemy template found for ${spawn.spawnConfig.enemy}`);

					this.spawnEnemy(spawn.spawnConfig, enemyTemplate, core, isClient);

					spawn.remaining -= 1;
					spawn.timer = spawn.spawnConfig.interval ?? 1;
				}
			}

			world.set(e, C.GameState.ActiveSpawns, activeSpawns);
		}
	}

	private spawnEnemy(
		spawnConfig: Types.Core.GameState.SpawnConfig,
		enemyConfig: Types.Core.GameState.EnemyConfig,
		core: Types.Core.API,
		isClient: boolean,
	) {
		const { world, C, R, P } = core;

		const routeIndex = spawnConfig.routeIndex ?? 1;
		const routeStart = R.getPosition(routeIndex, 0);
		if (!routeStart) return warn(`No start position for route ${routeIndex}`);

		const enemy = world.entity();
		world.add(enemy, C.Tags.Enemy);

		if (isClient) world.add(enemy, C.Tags.Predicted);

		const pos = P.position(0, 0);

		world.set(enemy, C.Combat.Health, enemyConfig.health ?? 0);
		world.set(enemy, C.Combat.Speed, enemyConfig.speed ?? 0);
		world.set(enemy, C.Movement.RouteIndex, routeIndex);
		world.set(enemy, C.Movement.World, routeStart);
		world.set(enemy, C.Movement.RoutePosIndex, 0);

		if (core.debug()) {
			const debugFolder = Workspace.FindFirstChild("Debug");
			if (!debugFolder) {
				warn("No Debug folder found in Workspace for enemy debug using Workspace as parent for debug parts");
			}

			const debugPart = new Instance("Part");
			debugPart.Name = `DebugEnemy${enemy}`;

			debugPart.Anchored = true;
			debugPart.CanCollide = false;
			debugPart.Transparency = 0.5;
			debugPart.Size = new Vector3(1, 1, 1);
			debugPart.Material = Enum.Material.Neon;
			debugPart.Color = isClient ? Color3.fromRGB(50, 150, 50) : Color3.fromRGB(150, 50, 50);

			const worldX = pos.X * core.G.tileSize + core.G.tileSize / 2;
			const worldZ = pos.Y * core.G.tileSize + core.G.tileSize / 2;
			const worldY = routeStart.Y;

			debugPart.CFrame = new CFrame(new Vector3(worldX, worldY, worldZ));

			debugPart.Parent = debugFolder ?? Workspace;

			world.set(enemy, C.Debug.Visualizer, debugPart);
		}

		if (!isClient) {
			world.set(enemy, networked, undefined);

			world.set(enemy, pair(reliable, C.Combat.Speed), undefined);
			world.set(enemy, pair(reliable, C.Combat.Health), undefined);
			world.set(enemy, pair(reliable, C.Movement.World), undefined);
			world.set(enemy, pair(reliable, C.Movement.RouteIndex), undefined);
			world.set(enemy, pair(reliable, C.Movement.RoutePosIndex), undefined);
		}
	}
}
