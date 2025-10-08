// Services
import { ContextActionService, RunService, Players, Workspace } from "@rbxts/services";

// Packages
import Network from "@shared/network";

// Types
import type * as Types from "@shared/types";
import { type Entity } from "@rbxts/jecs";

export default class TowerSystem {
	private Entity: Entity;
	private previewing = false;
	private previewPart?: Part;

	private inputConnMouseMove?: RBXScriptConnection;

	private groundContainer?: Model;
	private hillContainer?: Model;

	private rotationAngle = 0;
	private rotationStep = 45;

	constructor(private sim: Types.Core.API) {
		this.Entity = this.sim.world.entity();
		this.sim.world.add(this.Entity, this.sim.C.Tags.System);

		if (RunService.IsClient()) {
			this.refreshPlacementContainers();
			this.setupInputBindings();
		}
	}

	// ===== Helpers =====
	private refreshPlacementContainers() {
		const map = Workspace.WaitForChild("Map") as Model;
		this.groundContainer = map.FindFirstChild("GroundParts") as Model | undefined;
		this.hillContainer = map.FindFirstChild("AirParts") as Model | undefined;
	}

	private setupInputBindings() {
		const binds = [
			Enum.UserInputType.MouseButton1,
			Enum.KeyCode.One,
			Enum.KeyCode.Two,
			Enum.KeyCode.Three,
			Enum.KeyCode.Four,
			Enum.KeyCode.Five,
			Enum.KeyCode.Six,
			Enum.KeyCode.Q,
			Enum.KeyCode.R,
		];

		let index = 0;

		ContextActionService.BindAction(
			"TowerPlacement",
			(_, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					const code = input.KeyCode.Value;

					if (code >= Enum.KeyCode.One.Value && code <= Enum.KeyCode.Six.Value) {
						index = code - Enum.KeyCode.One.Value + 1;
						this.startPreview(index);
					}

					if (code === Enum.KeyCode.Q.Value) {
						this.cancelPreview();
						index = 0;
					}

					if (code === Enum.KeyCode.R.Value) {
						this.rotatePreview();
					}

					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						if (!index) return;
						Network.server
							.invoke(Network.keys.towers.placement, Network.keys.towers.placementReturn, [
								index,
								this.rotationAngle,
							])
							.then(([success, reason]) => {
								if (!success) {
									warn(`[TowerSystem] Failed to place tower: ${reason}`);
									return;
								}

								this.cancelPreview();
								index = 0;
							});
					}
				}
				return Enum.ContextActionResult.Sink;
			},
			false,
			...binds,
		);
	}
	private rotatePreview() {
		if (!this.previewPart) return;
		this.rotationAngle = (this.rotationAngle + this.rotationStep) % 360;
		this.previewPart.Orientation = new Vector3(
			this.previewPart.Orientation.X,
			this.rotationAngle,
			this.previewPart.Orientation.Z,
		);
	}
	private getUnitInIndex(index: number) {
		const playerData = this.sim.StateManager.playerData.getStatic(Players.LocalPlayer);
		if (!playerData) return;

		const team = playerData.team;
		if (!team) return;

		const uuid = team[index - 1];

		const unit = playerData.units.find((u) => u.uuid === uuid);
		if (!unit) return;

		return unit;
	}

	// ===== Actions =====
	private startPreview(towerIndex: number) {
		if (this.previewing) this.cancelPreview();
		this.previewing = true;

		const unit = this.getUnitInIndex(towerIndex);
		if (!unit) return;

		// Create preview part
		this.previewPart = new Instance("Part");
		this.previewPart.Size = new Vector3(1, 2, 1);
		this.previewPart.Anchored = true;
		this.previewPart.CanCollide = false;
		this.previewPart.CanQuery = false;
		this.previewPart.Transparency = 0.5;
		this.previewPart.Parent = Workspace;

		const highlight = new Instance("Highlight");
		highlight.Parent = this.previewPart;
		highlight.FillTransparency = 0.5;
		highlight.OutlineTransparency = 0.5;
		highlight.Enabled = true;

		// Instant initial positioning
		const player = Players.LocalPlayer;
		const mouse = player.GetMouse();

		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.FilterDescendantsInstances = [this.previewPart, player.Character!];

		this.inputConnMouseMove = RunService.RenderStepped.Connect(() => {
			if (!this.previewPart || !player.Character) return;

			const mouseRay = Workspace.CurrentCamera!.ScreenPointToRay(mouse.X, mouse.Y);
			const result = Workspace.Raycast(mouseRay.Origin, mouseRay.Direction.mul(500), rayParams);
			if (!result) return;

			const hit = result.Instance;
			const hitPos = result.Position;

			this.previewPart.Position = hitPos.add(new Vector3(0, this.previewPart.Size.Y / 2, 0));

			let validSurface = false;
			if (unit.terrain === "Ground" || unit.terrain === "Hybrid") {
				validSurface = this.groundContainer?.IsAncestorOf(hit) ?? false;
			}
			if (unit.terrain === "Air") {
				validSurface = this.hillContainer?.IsAncestorOf(hit) ?? false;
			}

			const collidingParts = this.previewPart.GetTouchingParts();
			const noHeavyClipping = collidingParts.size() === 0;

			const valid = validSurface && noHeavyClipping;
			this.previewPart.Color = valid ? Color3.fromRGB(0, 255, 0) : Color3.fromRGB(255, 0, 0);
		});
	}
	private cancelPreview() {
		this.previewing = false;
		if (this.inputConnMouseMove) {
			this.inputConnMouseMove.Disconnect();
			this.inputConnMouseMove = undefined;
		}
		if (this.previewPart) {
			this.previewPart.Destroy();
			this.previewPart = undefined;
		}
	}
	public place(player: Player, index: number, rotation: number): Types.Network.Towers.PlacementReturn {
		return [true, "Invalid"];
	}

	// ===== Core =====
	public tick(_dt: number) {}
}
