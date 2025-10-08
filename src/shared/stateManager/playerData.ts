// Services
import { RunService } from "@rbxts/services";

// Packages
import { SyncPayload } from "@rbxts/charm-sync";
import { useAtom } from "@rbxts/vide-charm";
import Object from "@rbxts/object-utils";

// Types
import type * as Types from "@shared/types";

// Configurations
import unitConfigurations from "@shared/configurations/units";

// Components
import states from "./states";

export default class PlayerData {
	private state = states.players;

	// Helpers
	private setupUnitConfig(data: Types.Network.States.PlayerData) {
		return data.units.map(
			(unit): Types.Network.States.PlayerData["units"][number] & Types.Configurations.Towers.Config => {
				const config = unitConfigurations[unit.id][unit.evo];
				if (!config) warn(`[PlayerData] Missing unit configuration for id: ${unit.id}`);

				return {
					...unit,
					...config,
				};
			},
		);
	}

	// Actions
	public getState(id: string) {
		return this.state().get(id);
	}
	public getProps(player: Player) {
		if (RunService.IsServer() && RunService.IsRunning()) {
			return warn("[PlayerData] getProps should only be called on the client");
		}

		return {
			gems: useAtom(() => this.state().get(tostring(player.UserId))?.gems ?? 0),

			units: useAtom(() => {
				const data = this.state().get(tostring(player.UserId));

				return data && data.units ? this.setupUnitConfig(data) : [];
			}),
			team: useAtom(() => this.state().get(tostring(player.UserId))?.team ?? []),
		};
	}
	public getStatic(player: Player) {
		const data = this.state().get(tostring(player.UserId));
		if (!data) return { gems: 0, units: [], team: [] };

		const units = data.units ? this.setupUnitConfig(data) : [];

		return {
			gems: data.gems ?? 0,

			team: data.team ?? [],
			units,
		};
	}

	// Core
	public set(id: string, newData: Types.Network.States.PlayerData) {
		return this.state((state) => {
			const newState = Object.deepCopy(state);
			newState.set(id, newData);
			return newState;
		});
	}
	public update(id: string, updater: (data: Types.Network.States.PlayerData) => Types.Network.States.PlayerData) {
		if (RunService.IsClient() && RunService.IsRunning()) {
			return warn("[PlayerData] update should only be called on the server");
		}

		this.state((state) => {
			const newState = Object.deepCopy(state);

			const data = newState.get(id);

			if (!data) return state;

			newState.set(id, updater(data));

			return newState;
		});
	}
	public delete(id: string) {
		if (RunService.IsClient()) return warn("[PlayerData] delete should only be called on the server");

		this.state((state) => {
			const newState = Object.deepCopy(state);
			newState.delete(id);
			return newState;
		});
	}

	public filterPayload(player: Player, payload: SyncPayload<typeof states>): SyncPayload<typeof states> {
		if (payload.type === "init") {
			return {
				...payload,
				data: {
					...payload.data,
					players: new Map([[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))!]]),
				},
			};
		}

		return {
			...payload,
			data: {
				...payload.data,
				players: payload.data.players
					? new Map([[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))!]])
					: undefined,
			},
		};
	}
}
