// Packages
import Replecs from "@rbxts/replecs";

// Components
import getCore from "@shared/ecs";

const replicator = Replecs.create_client(getCore().world);

replicator.init();

export default replicator;
