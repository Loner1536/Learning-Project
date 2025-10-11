// Services
import { Players, StarterGui, Workspace } from "@rbxts/services";

// Packages
import { Controller, OnStart } from "@flamework/core";
import Vide, { mount, source } from "@rbxts/vide";
import Network from "@shared/network";
import Forge from "@rbxts/forge";

// Types
import type * as Types from "@shared/types";

// Utility
import px from "shared/utility/px";

// Components
import ForgeApp from "./app";

// Player Info
const player = Players.LocalPlayer;

// Dependencies
import JecsManager from "../jecsManager";
import PlayerData from "@shared/stateManager/playerData";
import { useAtom } from "@rbxts/vide-charm";

@Controller({
	loadOrder: 1,
})
export default class InterfaceManager implements OnStart {
	constructor(private jecsManager: JecsManager) {}

	onStart() {
		const lobby = (
			<screengui Name={"Lobby"} ResetOnSpawn={false} IgnoreGuiInset Parent={player.WaitForChild("PlayerGui")} />
		) as ScreenGui;

		mount(() => {
			px.setTarget(Workspace.CurrentCamera!);

			Forge.render(lobby);

			const props = this.buildProps(player);
			if (!props) return error("couldn't build interface props");

			task.delay(1, () => {});

			return <ForgeApp props={props} />;
		}, lobby);

		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
	}

	public buildProps(player: Player) {
		const playerData = this.jecsManager.core.StateManager.playerData.getProps(player);
		if (!playerData) error("couldn't get player data for interface manager");

		const waveData = this.jecsManager.core.StateManager.waveData.getProps();
		if (!waveData) error("couldn't get wave data for interface manager");

		const waveDataAtom = this.jecsManager.core.StateManager.waveData.getState();
		if (!waveDataAtom) error("couldn't get wave data atom for interface manager");

		return {
			player: Players.LocalPlayer,

			core: this.jecsManager.core,

			playerData: playerData,
			waveData: waveData,

			vote: {
				visible: useAtom(() => waveDataAtom().canVote),
			},

			network: Network,
		} satisfies Types.InterfaceProps.default;
	}
}
