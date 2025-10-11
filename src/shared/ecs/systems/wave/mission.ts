// Services
import { Players, ReplicatedStorage, RunService, ServerStorage, Workspace } from "@rbxts/services";

// Packages
import { networked, reliable } from "@rbxts/replecs";
import { Entity, pair } from "@rbxts/jecs";

// Types
import type * as Types from "@shared/types";

// Modding
import { System, OnTick } from "@shared/modding/system";
import mapConfiguration from "@shared/configurations/maps";

@System("Wave", "Mission")
export class Mission implements OnTick {
	onTick(e: Entity, core: Types.Core.API, dt: number): void {
		const { world, C } = core;

		let votes = 0;
		for (const [_, voted] of world.query(C.Player.Voted).with(C.Tags.Player)) {
			if (voted) votes++;
			else continue;

			if (votes >= Players.GetPlayers().size()) {
				for (const [e] of world.query().with(C.Tags.Player)) {
					world.set(e, C.Player.Voted, false);
				}

				this.startMission(core);
			}
		}
	}

	onPlayerAdded(player: Player, e: Entity, core: Types.Core.API): void {
		const { world, C } = core;

		const playerEntity = world.entity();
		world.add(playerEntity, C.Tags.Player);
		world.set(playerEntity, networked, undefined);

		let playerCount = 0;
		for (const [_] of world.query(C.Tags.Player)) playerCount++;

		world.set(playerEntity, C.Player.UserId, player.UserId);
		world.set(playerEntity, C.Player.Voted, false);
		world.set(playerEntity, C.Player.Yen, 0);

		world.set(playerEntity, pair(reliable, C.Player.Voted), undefined);
		world.set(playerEntity, pair(reliable, C.Player.Yen), undefined);

		const MockedTeleportData = {
			difficulty: "normal",
			id: "Sand Village",
			type: "story",
		} satisfies Types.Core.Player.TeleportData;

		if (playerCount <= 1) {
			world.set(playerEntity, C.Player.Host, true);
			world.set(playerEntity, C.Player.TeleportData, MockedTeleportData);

			this.loadMap(MockedTeleportData.id, core);
		} else world.set(playerEntity, C.Player.Host, false);
	}
	onPlayerRemoving(player: Player, e: Entity, core: Types.Core.API): void {
		const { world, C } = core;

		for (const [e, id] of world.query(C.Player.UserId).with(C.Tags.Player)) {
			if (id === player.UserId) {
				const host = world.get(e, C.Player.Host);
				if (host) {
					warn("Host left");
				}
				world.delete(e);
				break;
			}
		}
	}

	private loadMap(id: string, core: Types.Core.API) {
		const { R, StateManager } = core;

		if (RunService.IsServer()) {
			const models = ServerStorage.FindFirstChild("assets")?.FindFirstChild("models");
			if (!models) error("Models folder not found in ServerStorage/assets");
			const maps = models.FindFirstChild("maps");
			if (!maps) error("Maps folder not found in ServerStorage/assets/models");

			const name = id.lower();
			const mapFolder = maps.FindFirstChild(name);
			if (!mapFolder) error(`Map folder ${name} not found in ServerStorage/assets/models/maps`);

			const originalMap = mapFolder.FindFirstChild("map") as Model | undefined;
			if (!originalMap) error(`Map ${name} not found in ServerStorage/assets/models/maps`);

			const map = originalMap.Clone();
			map.Name = "Map";
			map.Parent = Workspace;

			const enemiesFolder = mapFolder.FindFirstChild("enemies") as Folder | undefined;
			if (!enemiesFolder) error(`Enemies folder not found in map ${name}`);

			enemiesFolder.Clone().Parent = ReplicatedStorage.FindFirstChild("assets")?.FindFirstChild("models");

			StateManager.waveData.update((data) => {
				data.canVote = true;

				return data;
			});
		}

		const routeFolder = Workspace.WaitForChild("Map").WaitForChild("Route") as Folder | undefined;
		if (!routeFolder) error("No Route folder found in map");

		R.loadRoutes(routeFolder);
	}
	private startMission(core: Types.Core.API) {
		const { world, C } = core;

		for (const [e, teleportData] of world.query(C.Player.TeleportData).with(C.Tags.Player)) {
			if (!teleportData) continue;

			const mapConfig = mapConfiguration[teleportData.type][
				teleportData.id as never
			] as Types.Core.GameState.Mission;
			if (!mapConfig) return warn(`No map configuration for ${teleportData.id} (${teleportData.type})`);

			world.set(e, C.GameState.Mission, mapConfig);

			world.set(e, C.GameState.MapId, teleportData.id);
			world.set(e, C.GameState.Type, teleportData.type);
			world.set(e, C.GameState.Enemies, mapConfig.enemies);
			world.set(e, C.GameState.Difficulty, teleportData.difficulty);

			this.nextWave(e, core);
		}
	}
	private nextWave(e: Entity, state: Types.Core.API) {
		const { world, C } = state;

		const mission = world.get(e, C.GameState.Mission);
		if (!mission) return warn("No mission loaded");

		const currentWave = world.get(e, C.GameState.CurrentWave) ?? 1;
		if (!currentWave) return warn("No current wave");

		world.set(e, C.GameState.CurrentWave, currentWave + 1);
		world.set(e, C.GameState.ActiveWave, true);

		print("Starting wave", currentWave);

		world.set(
			e,
			C.GameState.ActiveSpawns,
			mission.waves[currentWave - 1].spawns.map((spawn) => ({
				spawnConfig: spawn,
				timer: spawn.at,
				remaining: spawn.count ?? 1,
			})),
		);
	}
}
