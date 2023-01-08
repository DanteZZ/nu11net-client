import app from "../app";

import wall from "../assets/sprites/wall.png";

import decorChair from "../assets/sprites/decor/chair.png";
import decorTable from "../assets/sprites/decor/table.png";

import devicePc from "../assets/sprites/devices/pc.svg";
import deviceNetworkSocket from "../assets/sprites/devices/networkSocket.png";

import bgRoom from "../assets/backgrounds/room_1.png";

export const aWall = app.assets.create(wall, "wall");

export const aDecorChair = app.assets.create(decorChair, "decorChair");
export const aDecorTable = app.assets.create(decorTable, "decorTable");

export const aDevicePc = app.assets.create(devicePc, "devicePc");
export const aDeviceNetowrkSocket = app.assets.create(
  deviceNetworkSocket,
  "deviceNetworkSocket"
);

export const aBgRoom = app.assets.create(bgRoom, "bgRoom");

export const loadAssets = () => app.assets.loadAssets();
