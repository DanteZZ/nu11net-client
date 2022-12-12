import app from "./app";
import "./project/sprites";

import { defaultLayer } from "./project/layers";
import { loadAssets } from "./project/assets";
import { loadScenes } from "./project/scenes";
import DefaultScene from "./project/scenes/default";

const Game = async () => {
    await loadAssets();
    loadScenes();

    app.instanceBuffer.setCanvas(defaultLayer);
    app.sceneBuffer.setCanvas(defaultLayer).setScene(DefaultScene).initScene();

    app.run();
    return app;
};

export default Game;
