export default function mergeEventHandlers<T extends {}>(defaults: T, user: T): T {
	const merged = {} as T;

	for (const [key, defHandler] of pairs(defaults)) {
		const userHandler = user
			? (user as unknown as Record<string, unknown>)[key as string]
			: undefined;

		if (typeIs(defHandler, "function") && typeIs(userHandler, "function")) {
			(merged as unknown as Record<string, unknown>)[key as string] = (...args: unknown[]) => {
				(defHandler as Callback)(...args);
				(userHandler as Callback)(...args);
			};
		} else {
			(merged as unknown as Record<string, unknown>)[key as string] = defHandler as unknown;
		}
	}

	for (const [key, userHandler] of pairs(user)) {
		const existing = (merged as unknown as Record<string, unknown>)[key as string];

		if (existing === undefined) {
			(merged as unknown as Record<string, unknown>)[key as string] = userHandler as unknown;
		}
	}

	return merged;
}
