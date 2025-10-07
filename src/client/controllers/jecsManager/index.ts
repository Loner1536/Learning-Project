// Services
import { Service, OnStart } from "@flamework/core";

// Components
import getSim from "@shared/ecs";

@Service()
export default class JecsManager implements OnStart {
	public sim = getSim();

	// TODO: Find out how to serialize
	onStart() {}
}
