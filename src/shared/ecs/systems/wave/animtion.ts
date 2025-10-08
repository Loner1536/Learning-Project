// Types
import type * as Types from "@shared/types";
import { type Entity } from "@rbxts/jecs";

// Components
import assets from "@shared/assets";

export default class AnimationManager {
	private animator: Animator;

	private walkAnimation: Animation;
	private runAnimation: Animation;

	constructor(
		private sim: Types.Core.API,
		private e: Entity,
	) {
		const model = this.sim.world.get(e, this.sim.C.Enemy.Model);
		if (!model) throw `No model found for entity ${e} while creating AnimationController`;

		const animationController = new Instance("AnimationController");

		this.animator = new Instance("Animator");
		this.animator.Parent = animationController;

		this.walkAnimation = new Instance("Animation");
		this.walkAnimation.AnimationId = assets.animations.enemies["Walk.rbxm"];
		this.walkAnimation.Parent = this.animator;

		this.runAnimation = new Instance("Animation");
		this.runAnimation.AnimationId = assets.animations.enemies["Run.rbxm"];
		this.runAnimation.Parent = this.animator;

		animationController.Parent = model;

		sim.U.observer([sim.C.Enemy.State], (e, id, value) => {
			if (e !== this.e) return;

			print("state changed", value);
		});
	}

	public walk() {
		const track = this.animator.LoadAnimation(this.walkAnimation);
		track.Priority = Enum.AnimationPriority.Movement;
		track.Looped = true;
		track.Play();
	}

	public run() {
		const track = this.animator.LoadAnimation(this.runAnimation);
		track.Priority = Enum.AnimationPriority.Movement;
		track.Looped = true;
		track.Play();
	}
}
