import { Flamework } from "@flamework/core";

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/ecs/systems");

Flamework.ignite();
