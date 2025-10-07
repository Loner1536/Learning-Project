export default class Interval {
	private nextTick: number;

	constructor(private intervalSeconds: number) {
		this.nextTick = os.clock() + intervalSeconds;
	}

	public tick(): boolean {
		const now = os.clock();
		if (now >= this.nextTick) {
			this.nextTick += this.intervalSeconds;
			return true;
		}
		return false;
	}
}
