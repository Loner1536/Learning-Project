// Types
import type * as Types from "@shared/types";

export type TeleportData = {
	id: string;
	type: Types.Core.Map.Type;
	difficulty: Types.Core.Map.Difficulty;
};

export type Host = {
	type: "host";
	data: TeleportData;
};
export type Member = {
	type: "member";
};
