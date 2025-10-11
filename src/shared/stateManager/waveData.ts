// Services
import { RunService } from "@rbxts/services";

// Packages
import { useAtom } from "@rbxts/vide-charm";
import Object from "@rbxts/object-utils";

// Types
import type * as Types from "@shared/types";

// Components
import states from "@shared/stateManager/states";

export default class WaveData {
	private state = states.waveData;

	public getState() {
		return this.state;
	}

	public getProps() {
		if (RunService.IsServer() && RunService.IsRunning()) {
			return warn("[WaveData] getProps should only be called on the client");
		}

		return {
			currentWave: useAtom(() => this.state()?.currentWave ?? 0),
			canVote: useAtom(() => this.state()?.canVote ?? false),
		};
	}

	public update(updater: (data: Types.Network.States.WaveData) => Types.Network.States.WaveData) {
		if (RunService.IsClient() && RunService.IsRunning()) {
			return warn("[WaveData] update should only be called on the server");
		}

		this.state((state) => {
			if (!state) return state;

			const newState = Object.deepCopy(state);
			return updater(newState);
		});
	}
}
