// Packages
import { Tag } from "@rbxts/jecs";

function Tags(defineTag: (name: string) => Tag) {
	return {
		Enemy: defineTag("Tags/Enemy"),
		Tower: defineTag("Tags/Tower"),
		Boss: defineTag("Tags/Boss"),

		System: defineTag("Tags/System"),
		Player: defineTag("Tags/Player"),

		Predicted: defineTag("Tags/Predicted"),
		Completed: defineTag("Tags/Completed"),
		Dead: defineTag("Tags/Dead"),
	} as const;
}

export default Tags;
