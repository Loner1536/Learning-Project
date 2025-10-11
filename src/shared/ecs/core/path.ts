export default class Path {
	private static readonly EPS = 1e-6;
	public nodes: Vector2[] = [];

	constructor() {}

	/** Set the nodes for this path */
	public setNodes(nodes: Vector2[]) {
		if (!nodes) return;
		this.nodes = nodes;
	}
	/** Get a node by index */
	public getNode(idx: number): Vector2 | undefined {
		return this.nodes[idx];
	}
	/** Clamp a node index to valid path range */
	private clampNode(idx: number): number {
		return math.clamp(idx, 0, math.max(0, this.nodes.size() - 1));
	}
	/** Length of a segment between two nodes */
	private segmentLength(a: Vector2, b: Vector2): number {
		return b.sub(a).Magnitude;
	}
	/** Interpolate along a segment (0..1) */
	private segmentPosition(a: Vector2, b: Vector2, t: number): Vector2 {
		return a.add(b.sub(a).mul(math.clamp(t, 0, 1)));
	}
	/** Get current position on path from node + progress */
	public position(node: number, progress: number): Vector2 {
		if (this.nodes.size() === 0) return new Vector2(0, 0);
		const idx = this.clampNode(node);
		const a = this.nodes[idx];
		const b = this.nodes[idx + 1] ?? a;
		return this.segmentPosition(a, b, progress);
	}
	/** Advance forward along the path by distance */
	public advance(
		node: number,
		progress: number,
		distance: number,
	): { node: number; progress: number; position: Vector2; reachedEnd: boolean } {
		if (this.nodes.size() === 0) return { node: 0, progress: 0, position: new Vector2(0, 0), reachedEnd: true };

		let currentNode = this.clampNode(node);
		let currentProgress = math.clamp(progress, 0, 1);
		let remaining = distance;

		while (remaining > Path.EPS && currentNode < this.nodes.size() - 1) {
			const a = this.nodes[currentNode];
			const b = this.nodes[currentNode + 1];
			const segLen = this.segmentLength(a, b);

			if (segLen <= Path.EPS) {
				currentNode += 1;
				currentProgress = 0;
				continue;
			}

			const segRemaining = segLen * (1 - currentProgress);

			if (remaining < segRemaining) {
				currentProgress += remaining / segLen;
				return {
					node: currentNode,
					progress: currentProgress,
					position: this.segmentPosition(a, b, currentProgress),
					reachedEnd: false,
				};
			}

			remaining -= segRemaining;
			currentNode += 1;
			currentProgress = 0;
		}

		const lastIdx = this.nodes.size() - 1;
		return { node: lastIdx, progress: 1, position: this.nodes[lastIdx], reachedEnd: true };
	}
	/** Move backward along the path by distance */
	public retreat(
		node: number,
		progress: number,
		distance: number,
	): { node: number; progress: number; position: Vector2; reachedStart: boolean } {
		if (this.nodes.size() === 0) return { node: 0, progress: 0, position: new Vector2(0, 0), reachedStart: true };

		let currentNode = this.clampNode(node);
		let currentProgress = math.clamp(progress, 0, 1);
		let remaining = distance;

		while (remaining > Path.EPS && (currentNode > 0 || currentProgress > Path.EPS)) {
			const a = this.nodes[currentNode];
			const b = this.nodes[currentNode + 1 >= this.nodes.size() ? currentNode : currentNode + 1];
			const segLen = this.segmentLength(a, b);

			if (segLen <= Path.EPS) {
				if (currentNode <= 0) break;
				currentNode -= 1;
				currentProgress = 1;
				continue;
			}

			const segBackAvailable = segLen * currentProgress;

			if (remaining < segBackAvailable) {
				currentProgress -= remaining / segLen;
				return {
					node: currentNode,
					progress: currentProgress,
					position: this.segmentPosition(a, b, currentProgress),
					reachedStart: false,
				};
			}

			remaining -= segBackAvailable;
			currentNode -= 1;
			currentProgress = 1;
		}

		return { node: 0, progress: 0, position: this.nodes[0], reachedStart: true };
	}
}
