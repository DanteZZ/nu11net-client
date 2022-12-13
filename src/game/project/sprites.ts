import app from "../app";
import {
  aWall,
  aDecorTable,
  aDecorChair,
  aDevicePc,
  aDeviceNetowrkSocket,
} from "./assets";

export const sWall = app.sprites.create(aWall, "sWall");

export const sDecorChair = app.sprites.create(aDecorChair, "sDecorChair");
export const sDecorTable = app.sprites.create(aDecorTable, "sDecorTable");

export const sDevicePc = app.sprites.create(aDevicePc, "sDevicePc", {
  frames: 2,
  speed: 0,
});
export const sDeviceNetworkSocket = app.sprites.create(
  aDeviceNetowrkSocket,
  "sDeviceNetworkSocket"
);
