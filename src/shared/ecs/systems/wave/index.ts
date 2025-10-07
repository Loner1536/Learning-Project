// Services
import { Players, RunService, ServerStorage, Workspace } from "@rbxts/services";

// Packages
import { pair, TagDiscriminator, World, type Entity } from "@rbxts/jecs";
import { networked, reliable, unreliable } from "@rbxts/replecs";

// Types
import type Components from "@shared/ecs/components";
import type * as Types from "@shared/types";

// Configurations
import mapConfiguration, { typeConfiguration } from "@shared/configurations/maps";

// Components
import Route from "./route";

export default class WaveSystem {
	public Entity: Entity;

	private synced: boolean = false;

	constructor(private sim: Types.Core.API) {
		this.Entity = this.sim.world.entity();
		this.sim.world.add(this.Entity, this.sim.C.Tags.System);

		if (RunService.IsServer()) {
			this.sim.world.set(this.Entity, networked, undefined);

			this.sim.world.set(this.Entity, pair(reliable, this.sim.C.Systems.Wave.Vote), undefined);

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
		}
	}

	// Helpers
	private startMission() {
		print("[WaveSystem] Starting Mission");

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
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.AllSpawned, false);
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
	private spawner(dt: number) {
		const activeSpawns = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.ActiveSpawns);
		const enemies = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Enemies);
		const routes = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Routes);
		if (!activeSpawns || !enemies || !routes) return;

		function debugVisual(e: Entity, world: World, C: Components, startNode: Vector3) {
			const debugFolder = Workspace.FindFirstChild("Debug") as Folder;

			const debugBox = new Instance("Part");
			debugBox.Name = `EnemyDebug-${e}`;
			debugBox.Transparency = 0.75;
			debugBox.Color = RunService.IsServer() ? new Color3(1, 0, 0) : new Color3(0, 1, 0);
			debugBox.Size = new Vector3(1, 1, 1);
			debugBox.CanCollide = false;
			debugBox.Anchored = true;

			debugBox.Position = startNode;

			debugBox.Parent = debugFolder;

			world.set(e, C.Debug.Visual, debugBox);
		}

		for (const batch of activeSpawns) {
			batch.timer -= dt;
			if (batch.timer <= 0 && batch.remaining > 0) {
				const route = routes[0];
				if (!route) continue;

				const startNode = route.path[0];
				const enemyDef = enemies.find((e) => e.id === batch.spawnConfig.enemy);
				if (!enemyDef) continue;

				const e = this.sim.world.entity();

				this.sim.world.add(e, this.sim.C.Tags.Enemy);
				this.sim.world.set(e, networked, undefined);

				this.sim.world.set(e, this.sim.C.Enemy.PathProgress, { node: 0, progress: 0 });
				this.sim.world.set(e, this.sim.C.Vectors.Grid, new Vector2(startNode.X, startNode.Y));
				this.sim.world.set(e, this.sim.C.Vectors.World, startNode);

				this.sim.world.set(e, this.sim.C.Enemy.MaxHealth, enemyDef.health);
				this.sim.world.set(e, this.sim.C.Enemy.Health, enemyDef.health);
				this.sim.world.set(e, this.sim.C.Enemy.Speed, enemyDef.speed);

				this.sim.world.set(e, pair(unreliable, this.sim.C.Enemy.MaxHealth), undefined);
				this.sim.world.set(e, pair(unreliable, this.sim.C.Enemy.Health), undefined);
				this.sim.world.set(e, pair(unreliable, this.sim.C.Enemy.Speed), undefined);

				this.sim.S.Enemy.updateSimpleOrientation(e, 0, route.path);

				batch.timer = math.max(0, batch.spawnConfig.interval);
				batch.remaining -= 1;

				if (batch.remaining <= 0) {
					this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.AllSpawned, true);
				}

				if (this.sim.debug) debugVisual(e, this.sim.world, this.sim.C, startNode);
			}
		}
	}

	// Actions
	public loadMap(teleportData: Types.Core.Party.TeleportData) {
		if (RunService.IsServer()) {
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
		}

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.GameSpeed, 1);
		this.sim.world.set(this.Entity, pair(reliable, this.sim.C.Systems.Wave.GameSpeed), undefined);

		const hpStocks = typeConfiguration[teleportData.type].maxStocks;
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.HpStocks, hpStocks);

		const mission = mapConfiguration[teleportData.type][teleportData.id as never] as Types.Core.Map.Mission;
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Mission, mission);
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Enemies, mission.enemies);

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Vote, true);

		this.loadRoute();
	}
	public vote(player: Player) {
		const Votes = this.sim.world.get(this.Entity, this.sim.C.Systems.Wave.Votes) || [];
		if (Votes.find((userId) => userId === tostring(player.UserId))) return;

		Votes.push(tostring(player.UserId));

		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Votes, Votes);

		if (Votes.size() !== 0 && Votes.size() >= Players.GetPlayers().size()) {
			this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.Vote, false);
			this.startMission();
		}
	}
	public speed(player: Player, num: number) {
		// TODO: Check if gamepass if ABOVE 2x
		if (num > 2) {
		}
		this.sim.world.set(this.Entity, this.sim.C.Systems.Wave.GameSpeed, math.clamp(num, 1, 3));
	}

	// Core
	public serverTick(dt: number) {
		this.spawner(dt);
	}
	public clientTick(dt: number) {
		this.spawner(dt);
	}
}
