// Services
import { RunService, ServerStorage, Workspace } from "@rbxts/services";

// Types
import type Components from "@shared/ecs/components";
import { OnChange, type Entity, type World } from "@rbxts/jecs";
import type * as Types from "@shared/types";

// Configurations
import mapConfiguration, { typeConfiguration } from "@shared/configurations/maps";

// Components
import Route from "./route";

export default class WaveSystem {
	private Entity: Entity;

	constructor(private sim: Types.Core.API) {
		this.Entity = this.sim.world.entity();
		this.sim.world.add(this.Entity, this.sim.C.Tags.System);

		// this.sim.U.Scheduler.System((...args) => {
		// 	const dt = args[0] as number;

		// 	this.sim.P.Run(this.sim.P.EnsureSystem("WaveSystem", "Update"), () => this.tick(dt));
		// });
	}

	// public tick(dt: number) {
	// 	if (!this.activeSpawns || !this.routes) return;

	// 	for (const batch of this.activeSpawns) {
	// 		batch.timer -= dt;
	// 		if (batch.timer <= 0 && batch.remaining > 0) {
	// 			const route = this.routes[batch.spawnConfig.routeIndex ?? 0];
	// 			if (!route) continue;

	// 			const startNode = route.path[0];
	// 			const enemyDef = this.enemyDefs.find((e) => e.id === batch.spawnConfig.enemy);
	// 			if (!enemyDef) continue;

	// 			print(`[WaveSystem] Spawning enemy "${enemyDef.id}" at route "${route.name}"`);

	// 			const e = this.sim.world.entity();
	// 			this.sim.world.add(e, this.sim.C.Tags.Enemy);
	// 			this.sim.world.set(e, this.sim.C.Enemy.MaxHealth, enemyDef.health);
	// 			this.sim.world.set(e, this.sim.C.Enemy.Health, enemyDef.health);
	// 			this.sim.world.set(e, this.sim.C.Enemy.Speed, enemyDef.speed);
	// 			this.sim.world.set(e, this.sim.C.Enemy.PathProgress, { node: 0, progress: 0 });
	// 			this.sim.world.set(e, this.sim.C.Vectors.Grid, new Vector2(startNode.X, startNode.Y));
	// 			this.sim.world.set(e, this.sim.C.Vectors.World, startNode);

	// 			// this.sim.S.Enemy.updateSimpleOrientation(e, 0, route.path);

	// 			batch.remaining -= 1;
	// 			batch.timer = math.max(0, batch.spawnConfig.interval);
	// 			this.enemiesAlive += 1;

	// 			if (this.sim.debug) {
	// 				const debugFolder = Workspace.FindFirstChild("Debug") as Folder;

	// 				const debugBox = new Instance("Part");
	// 				debugBox.Name = `EnemyDebug-${e}`;
	// 				debugBox.Color = new Color3(1, 0, 0);
	// 				debugBox.Size = new Vector3(1, 1, 1);
	// 				debugBox.CanCollide = false;
	// 				debugBox.Anchored = true;

	// 				debugBox.Position = startNode;

	// 				debugBox.Parent = debugFolder;

	// 				this.sim.world.set(e, this.sim.C.Debug.Visual, debugBox);
	// 			}
	// 		}
	// 	}
	// }

	// public prepareWave(waveIndex: number) {
	// 	const wave = this.mission?.waves[waveIndex];
	// 	if (!wave) return;

	// 	this.activeSpawns = wave.spawns.map((spawn) => ({
	// 		spawnConfig: spawn,
	// 		timer: spawn.at,
	// 		remaining: spawn.count ?? 1,
	// 	}));
	// }
	// public startMission() {
	// 	if (!this.mission || this.enemyDefs) return;

	// 	this.waveActive = false;
	// 	this.enemiesAlive = 0;
	// 	this.spawnCursor = 0;
	// 	this.emissions = [];
	// 	this.waveTime = 0;
	// }
	// public nextWave() {
	// 	if (!this.mission) return;

	// 	this.prepareWave(this.activeWave);

	// 	this.sim.StateManager.waveData.update((data) => {
	// 		this.activeWave += 1;
	// 		data.wave += 1;
	// 		print(`[WaveSystem] Starting wave ${this.activeWave}`);

	// 		return data;
	// 	});
	// }

	private loadRoute() {
		const route = new Route();

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Routes, route.buildRoutesFromWorld());

		const routes = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Routes);
		if (!routes) error("Failed to load routes from world");

		const validRoutes = routes.filter((r) => route.validateRoute(r));

		if (validRoutes.size() === 0)
			error("No valid routes found for Map. Ensure all routes are under Routes folder in Map.");

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.ActiveRoute, validRoutes[0]);

		const activeRoute = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.ActiveRoute);
		if (!activeRoute) error("Failed to set active route for Map");

		const path = activeRoute.path;

		if (this.sim.debug) print(`Using route "${activeRoute.name}" with ${path.size()} waypoints`);
		if (this.sim.debug)
			print(
				"Route path:",
				path.map((p) => `(${p.X},${p.Y})`),
			);

		if (this.sim.debug) print(`[WaveSystem] Loaded ${routes.size()} routes`);
	}
	public loadMap(teleportData: Types.Core.Party.TeleportData) {
		if (RunService.IsClient() && RunService.IsRunning()) return;

		if (RunService.IsRunning()) {
			const models = ServerStorage.FindFirstChild("assets")?.FindFirstChild("models") as Folder;
			assert(models, "[WaveSystem] ServerStorage/models folder not found");

			const maps = models.FindFirstChild("maps") as Folder;
			assert(maps, "[WaveSystem] ServerStorage/models/maps folder not found");

			const map = maps?.FindFirstChild(teleportData.id) as Model;

			if (!map) {
				warn(`[WaveSystem] Map with id "${teleportData.id}" not found in ServerStorage/models/maps`);
				return;
			}

			map.Name = "Map";
			map.Parent = Workspace;

			this.loadRoute();
		}

		const hpStocks = typeConfiguration[teleportData.type].maxStocks;
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.HpStocks, hpStocks);

		const mission = mapConfiguration[teleportData.type][teleportData.id as never] as Types.Core.Map.Mission;
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Mission, mission);
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Enemies, mission.enemies);

		task.delay(2, () => {
			this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.HpStocks, hpStocks - 1);
		});

		print(`[WaveSystem] Loaded map "${teleportData.id}" of type "${teleportData.type}"`);

		this.sim.U.observer(
			[this.sim.C.Systems.Wave.HpStocks, this.sim.C.Systems.Wave.GameSpeed],
			(entity, id, value) => {
				this.sim.StateManager.waveData.update((data) => {
					if (id === this.sim.C.Systems.Wave.HpStocks) {
						data.hpStocks = value;
					} else if (id === this.sim.C.Systems.Wave.GameSpeed) {
						data.gameSpeed = value;
					}

					return data;
				});
			},
		);
		this.sim.U.observer([this.sim.C.Systems.Wave.HpStocks, this.sim.C.Systems.Wave.GameSpeed], (_e, id, value) => {
			this.sim.StateManager.waveData.update((data) => ({
				...data,

				hpStocks: id === this.sim.C.Systems.Wave.HpStocks ? value : data.hpStocks,
				gameSpeed: id === this.sim.C.Systems.Wave.GameSpeed ? value : data.gameSpeed,
			}));
		});
	}
}
