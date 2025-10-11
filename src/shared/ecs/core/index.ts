// Services
import { RunService, ContextActionService } from "@rbxts/services";

// Packages
import { world, type CachedQuery, type Entity, type World } from "@rbxts/jecs";
import Jabby, { applets, register } from "@rbxts/jabby";
import { Plugin } from "@rbxts/planck-runservice";
import { Scheduler } from "@rbxts/planck";

// Components
import StateManager from "@shared/stateManager";
import Components from "../components";
import JabbyProfiler from "./jabby";
import Route from "./route";
import Path from "./path";
import Grid from "./grid";

export default class Core {
	public world: World;

	public C: Components;
	public R: Route;
	public G: Grid;
	public P: Path;

	public JabbyProfiler = new JabbyProfiler();
	public StateManager = new StateManager();
	public Scheduler: Scheduler<[this]>;

	private debugs = {
		server: true,
		client: true,
	};

	constructor() {
		this.world = world();

		const grid = { width: 16, height: 9, tileSize: 1 };

		this.C = new Components(this);
		this.R = new Route(this);
		this.G = new Grid(grid);
		this.P = new Path();

		this.Scheduler = new Scheduler(this);

		this.Scheduler.addPlugin(new Plugin());

		this.JabbyProfiler.Init("Gameplay");

		register({
			applet: applets.world,
			name: "Gameplay",
			configuration: {
				world: this.world,
			},
		});

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

	public interval(s: number): () => boolean {
		let pin: number | undefined;

		return (): boolean => {
			if (pin === undefined) pin = os.clock();

			const elapsed = os.clock() - pin > s;
			if (elapsed) pin = os.clock();

			return elapsed;
		};
	}

	public debug() {
		return RunService.IsServer() ? this.debugs.server : this.debugs.client;
	}
}
