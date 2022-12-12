import app from "../app";
import DefaultScene from "./scenes/default";

export const loadScenes = () => {
  app.sceneBuffer.add(DefaultScene);
};

export default app.sceneBuffer;
