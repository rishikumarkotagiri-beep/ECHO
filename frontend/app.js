import EchoBrainV3 from "../core/echo.js";
import { World } from "../world/world.js";

const world = new World();

const echo = new EchoBrainV3(world);

const result = echo.step({
    type: "environment",
    objects: world.objects || [],
    timestamp: Date.now()
});

console.log("ECHO:", result);
