// Packages
import { Service, OnInit } from "@flamework/core";

// Components
import getSim from "@shared/ecs";

@Service()
export default class JecsManager implements OnInit {
	public sim = getSim();

	onInit() {}
}
