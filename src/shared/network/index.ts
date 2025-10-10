// Packages
import type { SerializeablePayload } from "@rbxts/charm-payload-converter";
import { MessageEmitter } from "@rbxts/tether";

// Types
import type * as Types from "@shared/types";
import type { u8, u16, Tuple } from "@rbxts/serio";

// Components
import states from "@shared/stateManager/states";

export const keys = {
	state: {
		sync: 0,
		init: 1,
	},
	wave: {
		vote: 50,
		voteReturn: 51,
		gameSpeed: 52,
		gameSpeedReturn: 53,
	},
	towers: {
		placement: 100,
		placementReturn: 101,

		selectUnit: 102,
		selectUnitReturn: 103,
	},
	jecs: {
		receiveFull: 150,
		receiveFullReturn: 151,

		sendUpdates: 152,
	},
} as const;

type MessengerPayloads = {
	[keys.state.sync]: SerializeablePayload<typeof states>;
	[keys.state.init]: void;

	[keys.wave.vote]: void;
	[keys.wave.voteReturn]: boolean;

	[keys.wave.gameSpeed]: u8;
	[keys.wave.gameSpeedReturn]: boolean;

	[keys.towers.placement]: Types.Network.Towers.Placement;
	[keys.towers.placementReturn]: Types.Network.Towers.PlacementReturn;

	[keys.towers.selectUnit]: Instance;

	[keys.jecs.receiveFull]: void;
	[keys.jecs.receiveFullReturn]: Types.Network.Jecs.ReplecsData;
	[keys.jecs.sendUpdates]: Types.Network.Jecs.ReplecsData;
};

function createMessenger() {
	const Messenger = MessageEmitter.create<MessengerPayloads>();

	return {
		...Messenger,
		keys,
	};
}

let Network: ReturnType<typeof createMessenger> | undefined = undefined;

export default Network ?? createMessenger();
