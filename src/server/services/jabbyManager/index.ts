// Packages
import { Service, OnInit } from "@flamework/core";

// Components
import getSim from "@shared/ecs";

@Service()
export default class JabbyService implements OnInit {
	public onInit() {
		const sim = getSim();
		sim.P.Init("gameplay");
	}
}
