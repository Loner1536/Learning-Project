export type BuilderConfig = {
	grid: {
		width: number;
		height: number;
		tileSize: number;
	};
};

export type Info = {
	name: string;
	path: Vector3[];
	models: DefinedModel[];
};

export type DefinedModel = Model & {
	Parent: Folder;
	Start: BasePart;
	End: BasePart;
};
