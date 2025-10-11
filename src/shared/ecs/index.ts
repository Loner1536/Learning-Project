// Components
import Core from "./core";

let core: Core | undefined;

export default function getCore(): Core {
	if (!core) {
		core = new Core();
	}
	return core;
}
