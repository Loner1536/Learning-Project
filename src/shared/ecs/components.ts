// Packages
import Replecs from "@rbxts/replecs";
import Jecs from "@rbxts/jecs";

// Types
import * as Types from "@shared/types";

class BaseComponents {
	constructor(protected sim: Types.Core.API) {}

	protected defineComponent<T>(name: string) {
		const comp = this.sim.world.component<T>();
		this.sim.world.set(comp, Jecs.Name, name);
		this.sim.world.add(comp, Replecs.Shared);
		return comp;
	}

	protected defineTag(name: string) {
		const tag = this.sim.world.entity();
		this.sim.world.set(tag, Jecs.Name, name);
		this.sim.world.add(tag, Replecs.Shared);
		return tag;
	}
}

// Tags
class Tags extends BaseComponents {
	public Enemy = this.defineTag("Enemy");
	public Tower = this.defineTag("Tower");
	public Boss = this.defineTag("Boss");

	public Player = this.defineTag("Player");

	public Predicted = this.defineTag("Predicted");
	public Completed = this.defineTag("Completed");
	public Dead = this.defineTag("Dead");
}

// Player
class PlayerComponents extends BaseComponents {
	public Host = this.defineComponent<boolean>("Player/Host");
	public UserId = this.defineComponent<number>("Player/UserId");
	public Yen = this.defineComponent<number>("Player/Yen");
	public Voted = this.defineComponent<boolean>("Player/Voted");
	public TeleportData = this.defineComponent<Types.Core.Player.TeleportData | undefined>("Player/TeleportData");
}

// Movement
class MovementComponents extends BaseComponents {
	public Orientation = this.defineComponent<Vector3>("Orientation");
	public MoveDir = this.defineComponent<Vector2>("MoveDir");
	public World = this.defineComponent<Vector3>("WorldPos");
	public Grid = this.defineComponent<Vector2>("GridPos");

	// Route
	public Progress = this.defineComponent<number>("Progress");
	public RouteIndex = this.defineComponent<number>("RouteIndex");
	public RoutePosIndex = this.defineComponent<number>("RoutePosIndex");
}

// GameState
class GameStateComponents extends BaseComponents {
	// Mission
	public MapId = this.defineComponent<string>("MapId");
	public Type = this.defineComponent<Types.Core.GameState.Type>("Type");
	public Difficulty = this.defineComponent<Types.Core.GameState.Difficulty>("Difficulty");
	public Mission = this.defineComponent<Types.Core.GameState.Mission>("Mission");

	// Wave
	public ActiveSpawns = this.defineComponent<Types.Core.GameState.ActiveSpawn[]>("ActiveSpawns");
	public Enemies = this.defineComponent<Types.Core.GameState.EnemyConfig[]>("Enemies");
	public CurrentWave = this.defineComponent<number>("CurrentWave");
	public ActiveWave = this.defineComponent<boolean>("ActiveWave");

	// Spawner
	public IsSpawning = this.defineComponent<boolean>("IsSpawning");
}

// Combat
class CombatComponents extends BaseComponents {
	public TargetMode = this.defineComponent<Types.Core.Combat.TargetMode>("TargetMode");
	public Cooldown = this.defineComponent<Types.Core.Combat.Cooldown>("Cooldown");
	public Damage = this.defineComponent<number>("Damage");
	public Range = this.defineComponent<number>("Range");

	public Profile = this.defineComponent<Types.Core.Combat.Profile>("Profile");
	public AttackEvent = this.defineComponent<Types.Core.Combat.Event>("Event");

	public Health = this.defineComponent<number>("Health");
	public KillCreditOwnerId = this.defineComponent<string>("KillCreditOwnerId");
	public Bounty = this.defineComponent<number>("Bounty");
	public Speed = this.defineComponent<number>("Speed");
}

// Identity
class IdentityComponents extends BaseComponents {
	public Id = this.defineComponent<string>("Id");
	public UUID = this.defineComponent<string>("UUID");
	public OwnerId = this.defineComponent<string>("OwnerId");
	public PlacementTime = this.defineComponent<number>("PlacementTime");
	public Model = this.defineComponent<Model | undefined>("Model");
}

// Debug
class DebugComponents extends BaseComponents {
	public Visualizer = this.defineComponent<BasePart>("Visualizer");
}

// --- Main Components class ---
export default class Components {
	public readonly Tags: Tags;
	public readonly Player: PlayerComponents;
	public readonly Movement: MovementComponents;
	public readonly GameState: GameStateComponents;
	public readonly Combat: CombatComponents;
	public readonly Identity: IdentityComponents;
	public readonly Debug: DebugComponents;

	constructor(private sim: Types.Core.API) {
		this.Tags = new Tags(sim);
		this.Player = new PlayerComponents(sim);
		this.Movement = new MovementComponents(sim);
		this.GameState = new GameStateComponents(sim);
		this.Combat = new CombatComponents(sim);
		this.Identity = new IdentityComponents(sim);
		this.Debug = new DebugComponents(sim);
	}
}
