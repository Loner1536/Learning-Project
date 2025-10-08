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
		return this.state();
	}

	public getProps() {
		if (RunService.IsServer() && RunService.IsRunning()) {
			return warn("[WaveData] getProps should only be called on the client");
		}

		return {
			id: useAtom(() => this.state().id ?? "test"), // TODO: in the future make this get the whole config
			type: useAtom(() => this.state().type ?? "normal"),
			hpStocks: useAtom(() => this.state().hpStocks ?? 0),
			vote: useAtom(() => this.state().vote ?? false),
			votes: useAtom(() => this.state().votes ?? 0),
			gameSpeed: useAtom(() => this.state().gameSpeed ?? 1),
			wave: useAtom(() => this.state().wave ?? 0),
			act: useAtom(() => this.state().act ?? 0),

			enemies: useAtom(() => this.state().enemies ?? []),
		};
	}

	public update(updater: (data: Types.Network.States.WaveData) => Types.Network.States.WaveData) {
		if (RunService.IsClient() && RunService.IsRunning()) {
			return warn("[WaveData] update should only be called on the server");
		}

		this.state((state) => {
			const newState = Object.deepCopy(state);
			return updater(newState);
		});
	}
}
