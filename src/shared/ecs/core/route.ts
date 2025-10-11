// Services
import { Workspace } from "@rbxts/services";

// Types
import type * as Types from "@shared/types";

export type RouteData = {
	name: string;
	positions: Vector3[];
	gridPositions: Vector2[];
};

export default class RouteManager {
	private routes: Map<number, RouteData> = new Map();

	constructor(private core: Types.Core.API) {}

	/** Loads routes from the map's Route folder */
	public loadRoutes(routesFolder: Folder) {
		for (const folder of routesFolder.GetChildren()) {
			if (!folder.IsA("Folder")) continue;

			const routeIndex = tonumber(folder.Name);
			if (!routeIndex) continue;

			const models = folder.GetChildren().filter((c) => c.IsA("Model")) as Model[];

			if (models.size() === 0) continue;

			// Sort models numerically by Name
			models.sort((a, b) => (tonumber(a.Name) ?? 0) < (tonumber(b.Name) ?? 0));

			const positions: Vector3[] = [];

			for (const model of models) {
				const startPart = model.FindFirstChild("Start") as BasePart | undefined;
				const endPart = model.FindFirstChild("End") as BasePart | undefined;

				if (!startPart || !endPart) {
					warn(`Model '${model.Name}' missing Start or End`);
					continue;
				}

				positions.push(startPart.Position, endPart.Position);
			}

			if (positions.size() < 2) continue;

			const gridPositions = positions.map((pos) => this.core.G.toGrid(new Vector2(pos.X, pos.Z)));

			const cleanedGridPositions = this.removeDuplicatePoints(gridPositions);

			this.routes.set(routeIndex, {
				name: folder.Name,
				positions,
				gridPositions: cleanedGridPositions,
			});
		}
	}

	/** Get a world position by route index and position index */
	public getPosition(routeIndex: number, posIndex: number): Vector3 | undefined {
		const route = this.routes.get(routeIndex);
		if (!route) return undefined;
		return route.positions[posIndex];
	}

	/** Get a grid position by route index and position index */
	public getGridPosition(routeIndex: number, posIndex: number): Vector2 | undefined {
		const route = this.routes.get(routeIndex);
		if (!route) return undefined;
		return route.gridPositions[posIndex];
	}

	/** Remove consecutive duplicate points from grid path */
	private removeDuplicatePoints(path: Vector2[]): Vector2[] {
		if (path.size() <= 1) return path;

		const cleaned: Vector2[] = [path[0]];
		for (let i = 1; i < path.size(); i++) {
			const prev = cleaned[cleaned.size() - 1];
			const curr = path[i];
			if (curr.X !== prev.X || curr.Y !== prev.Y) cleaned.push(curr);
		}
		return cleaned;
	}

	/** Validate that a route has at least start and end */
	public validateRoute(routeIndex: number): boolean {
		const route = this.routes.get(routeIndex);
		return route !== undefined && route.positions.size() >= 2;
	}

	/** Get full route data by index */
	public getRoute(routeIndex: number): RouteData | undefined {
		return this.routes.get(routeIndex);
	}
}
