// Packages
import { type Entity } from "@rbxts/jecs";

function Player(defineComponent: <T>(name: string) => Entity<T>) {
	return {
		UserId: defineComponent<number>("Player/UserId"),
		Yen: defineComponent<number>("Player/Yen"),
	} as const;
}

export default Player;
