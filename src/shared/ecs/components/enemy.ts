// Packages
import { type Entity } from "@rbxts/jecs";

function Enemy(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		Model: defineComponent<Model | undefined>("Enemy/Model"),
		Id: defineComponent<string>("Enemy/Id"),

		RenderedCFrame: defineComponent<CFrame>("Enemy/RenderedPosition"),

		KillCreditOwnerId: defineComponent<string>("Enemy/KillCreditOwnerId"),
		RouteIndex: defineComponent<number>("Enemy/RouteIndex"),

		PredictedHealth: defineComponent<number>("Enemy/PredictedHealth"),
		MaxHealth: defineComponent<number>("Enemy/MaxHealth"),
		Health: defineComponent<number>("Enemy/Health"),
		Speed: defineComponent<number>("Enemy/Speed"),

		ShieldMultiplier: defineComponent<number>("Enemy/ShieldMultiplier"),
		MaxShield: defineComponent<number>("Enemy/MaxShield"),
		Shield: defineComponent<number>("Enemy/Shield"),
		Bounty: defineComponent<number>("Enemy/Bounty"),

		PathProgress: defineComponent<{ node: number; progress: number }>("Enemy/PathProgress"),
		PathIndex: defineComponent<number>("Enemy/PathIndex"),

		State: defineComponent<"idle" | "walking" | "running" | "dead">("Enemy/State"),
	} as const;
}

export default Enemy;
