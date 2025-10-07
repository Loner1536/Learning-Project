// Packages
import Replecs from "@rbxts/replecs";

// Components
import getSim from "@shared/ecs";

const replicator = Replecs.create_server(getSim().world);

replicator.init();

export default replicator;
