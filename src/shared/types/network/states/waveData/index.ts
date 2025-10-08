// Types
import { u8, u16 } from "@rbxts/serio";

export type WaveData = {
	id: string;
	type: "story";
	hpStocks: u8;
	vote: boolean;
	enemies: u16;
	gameSpeed: u8;
	votes: u8;
	wave: u8;
	act: u8;
};
