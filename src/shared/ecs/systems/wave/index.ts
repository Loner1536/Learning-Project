// Services
import { Players, RunService, ServerStorage, Workspace } from "@rbxts/services";

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

		this.sim.U.observer(
			[
				this.sim.C.Systems.Wave.ActiveWave,
				this.sim.C.Systems.Wave.GameSpeed,
				this.sim.C.Systems.Wave.HpStocks,
				this.sim.C.Systems.Wave.Votes,
				this.sim.C.Systems.Wave.Vote,
			],
			(_, id, value) => {
				this.sim.StateManager.waveData.update((data) => ({
					...data,

					gameSpeed: id === this.sim.C.Systems.Wave.GameSpeed ? (value as number) : data.gameSpeed,
					hpStocks: id === this.sim.C.Systems.Wave.HpStocks ? (value as number) : data.hpStocks,
					votes: id === this.sim.C.Systems.Wave.Votes ? (value as string[]).size() : data.votes,
					wave: id === this.sim.C.Systems.Wave.ActiveWave ? (value as number) : data.wave,
					vote: id === this.sim.C.Systems.Wave.Vote ? (value as boolean) : data.vote,
				}));
			},
		);

		this.sim.U.Scheduler.System((...args) => {
			const dt = args[0] as number;

			this.sim.P.Run(this.sim.P.EnsureSystem("WaveSystem", "Update"), () => this.tick(dt));
		});
	}
	public tick(dt: number) {
		const activeSpawns = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.ActiveSpawns);
		const enemies = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Enemies);
		const routes = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Routes);
		if (!activeSpawns || !routes || !enemies) return;

		for (const batch of activeSpawns) {
			batch.timer -= dt;
			if (batch.timer <= 0 && batch.remaining > 0) {
				const route = routes[batch.spawnConfig.routeIndex ?? 0];
				if (!route) continue;

				const startNode = route.path[0];
				const enemyDef = enemies.find((e) => e.id === batch.spawnConfig.enemy);
				if (!enemyDef) continue;

				const e = this.sim.world.entity();
				this.sim.world.add(e, this.sim.C.Tags.Enemy);
				this.sim.world.set(e, this.sim.C.Enemy.MaxHealth, enemyDef.health);
				this.sim.world.set(e, this.sim.C.Enemy.Health, enemyDef.health);
				this.sim.world.set(e, this.sim.C.Enemy.Speed, enemyDef.speed);
				this.sim.world.set(e, this.sim.C.Enemy.PathProgress, { node: 0, progress: 0 });
				this.sim.world.set(e, this.sim.C.Vectors.Grid, new Vector2(startNode.X, startNode.Y));
				this.sim.world.set(e, this.sim.C.Vectors.World, startNode);

				this.sim.S.Enemy.updateSimpleOrientation(e, 0, route.path);

				batch.timer = math.max(0, batch.spawnConfig.interval);
				batch.remaining -= 1;

				if (this.sim.debug) {
					const debugFolder = Workspace.FindFirstChild("Debug") as Folder;

					const debugBox = new Instance("Part");
					debugBox.Name = `EnemyDebug-${e}`;
					debugBox.Color = new Color3(1, 0, 0);
					debugBox.Size = new Vector3(1, 1, 1);
					debugBox.CanCollide = false;
					debugBox.Anchored = true;

					debugBox.Position = startNode;

					debugBox.Parent = debugFolder;

					this.sim.world.set(e, this.sim.C.Debug.Visual, debugBox);
				}
			}
		}
	}

	private startMission() {
		const mission = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Mission);
		const enemies = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Enemies);

		if (!mission || !enemies) return;

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.WaveActive, false);
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.ActiveWave, 0);
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.WaveTime, 0);

		this.nextWave(mission);
	}
	private nextWave(mission: Types.Core.Map.Mission) {
		if (!mission) return;

		const currentWave = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.ActiveWave);
		if (currentWave === undefined) error("Failed to retrieve current wave index");

		const newWave = currentWave + 1;
		if (!newWave) error("Failed to retrieve current wave index");

		const spawns = mission.waves[newWave - 1].spawns;

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.ActiveWave, newWave);
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.WaveActive, true);
		this.sim.world.set(
			this.Entity,
			this.sim.C.Systems.Wave.ActiveSpawns,
			spawns.map((spawn) => ({
				spawnConfig: spawn,
				timer: spawn.at,
				remaining: spawn.count ?? 1,
			})),
		);
	}

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

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Vote, true);
	}
	public vote(player: Player) {
		const Votes = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Votes) || [];
		if (Votes.find((userId) => userId === tostring(player.UserId))) return;

		Votes.push(tostring(player.UserId));
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Votes, Votes);

		if (Votes.size() >= Players.GetPlayers().size()) {
			this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Vote, false);
			this.startMission();
		}
	}
}
