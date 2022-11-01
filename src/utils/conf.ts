import fs from "fs";
import path from "path";
import { basedir } from "./consts";

interface iCfg {
  serverList: Object;
  login: string;
  password: string;
  selectedServer: string;
  serversDir: string;
  fullscreen: boolean;
  [ley: string]: any;
}

class CONF {
  constructor() {}
  public cfg: iCfg = {
    serverList: {},
    login: "",
    password: "",
    selectedServer: "",
    serversDir: "servers",
    fullscreen: true,
  };
  load() {
    if (!fs.existsSync(path.join(basedir, "config.json"))) {
      this.save();
    }
    let data = fs.readFileSync(path.join(basedir, "config.json"), "utf-8");
    this.parseJSON(data);
  }

  save() {
    fs.writeFileSync(
      path.join(basedir, "config.json"),
      JSON.stringify(this.cfg, null, "\t"),
      "utf-8"
    );
  }

  parseJSON(data: string | unknown): void {
    if (typeof data === "string") {
      this.cfg = JSON.parse(data);
    }
  }
  get() {
    return this.cfg;
  }
  set(data: iCfg) {
    if (data) {
      for (var k in data) {
        this.cfg[k] = data[k];
      }
    }
  }
}

const conf = new CONF();
conf.load();

export default conf;
