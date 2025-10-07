// Packages
import Replecs from "@rbxts/replecs";

// Components
import getSim from "@shared/ecs";

const replicator = Replecs.create_client(getSim().world);

replicator.init();

export default replicator;
