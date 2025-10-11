// Types
import type * as Types from "@shared/types";

export default class Grid {
	public readonly width: number;
	public readonly height: number;
	public readonly tileSize: number;

	constructor(cfg: Types.Core.GridConfig) {
		this.width = cfg.width;
		this.height = cfg.height;
		this.tileSize = cfg.tileSize ?? 1;
	}

	public inBounds(p: Vector2): boolean {
		return p.X >= 0 && p.Y >= 0 && p.X < this.width && p.Y < this.height;
	}

	// Convert grid coords to world 2D coords (still Vector2, for logic-only sim)
	public toWorld(p: Vector2): Vector2 {
		return new Vector2(p.X * this.tileSize + this.tileSize / 2, p.Y * this.tileSize + this.tileSize / 2);
	}

	// Snap a world 2D position back to grid coords
	public toGrid(p: Vector2): Vector2 {
		return new Vector2(math.floor(p.X / this.tileSize), math.floor(p.Y / this.tileSize));
	}
}
