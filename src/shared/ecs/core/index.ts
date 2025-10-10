// Services
import { RunService, ContextActionService } from "@rbxts/services";

// Packages
import { Plugin } from "@rbxts/planck-runservice";
import { world, type World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";
import Jabby from "@rbxts/jabby";

// Components
import StateManager from "@shared/stateManager";
import Components from "../components";
import JabbyProfiler from "./jabby";
import Grid from "./grid";

export default class Core {
	public world: World;
	public grid: Grid;

	public C: Components;

	public JabbyProfiler = new JabbyProfiler();
	public StateManager = new StateManager();
	public Scheduler: Scheduler<[this]>;

	private debugs = {
		server: true,
		client: false,
	};

	constructor() {
		this.world = world();
		this.grid = new Grid({ width: 16, height: 9, tileSize: 1 });

		this.C = new Components(this);

		this.Scheduler = new Scheduler(this);

		this.Scheduler.addPlugin(new Plugin());

		this.JabbyProfiler.Init("Gameplay");

		if (RunService.IsClient()) this.bindJabbyProfiler();
	}

	private bindJabbyProfiler() {
		const client = Jabby.obtain_client();

		const createWidget = (_: unknown, state: Enum.UserInputState) => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}
			client.spawn_app(client.apps.home);
		};

		ContextActionService.BindAction("Open Jabby Home", createWidget, false, Enum.KeyCode.F4);
	}

	public debug() {
		return RunService.IsServer() ? this.debugs.server : this.debugs.client;
	}
}
