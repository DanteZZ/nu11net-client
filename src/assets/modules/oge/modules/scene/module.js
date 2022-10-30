let fns = {
  regScene: function (info) {
    if (!info) {
      return false;
    }
    if (!info.name) {
      return false;
    }
    this._scenes[info.name] = new Scene(info);
    this._scenes[info.name]._oge = this;
    return this._scenes[info.name];
  },

  loadScene: function (name) {
    if (!this._scenes[name]) {
      return false;
    }

    this._graph.destroyAll();
    let scene = this._scenes[name];

    this._em.emit("before_scene_load", scene);

    if (scene.layers) {
      for (var k in scene.layers) {
        let layer = scene.layers[k];
        switch (layer.type) {
          case "2d":
            this._graph.createCanvas(k, layer.type);
            break;
        }
      }
    }

    if (scene._create) {
      scene._create();
    }

    if (scene.cameras) {
      for (var k in scene.cameras) {
        this.createCamera(k, scene.cameras[k]);
      }
    }

    this.buffer.scene = this._scenes[name];
    this.buffer.defaultLayer = scene.defaultLayer;

    this.setCamera(scene.defaultCam);

    if (scene.instances) {
      for (var k in scene.instances) {
        this.createInstance(scene.instances[k]);
      }
    }

    this._em.emit("after_scene_load", scene);

    return true;
  },
};

class Scene {
  constructor(info) {
    let inf = {
      name: "example",
      layers: { game: { name: "game", position: 0 } },
      defaultLayer: "game",
    };

    info = Object.assign(inf, info);

    for (var k in info) {
      this[k] = info[k];
    }

    return this;
  }

  addLayer(info) {
    if (!info) {
      return false;
    }
    if (!info.name || this.layers[info.name]) {
      return false;
    }

    let inf = {
      name: "game",
      position: this.layers.length,
    };

    info = $.extend(inf, info);

    this.layers[info.name] = info;
    return this.layers[info.name];
  }

  _updateLayers() {
    if (this.layers) {
      for (var name in this.layers) {
        let layer = this.layers[name];

        switch (layer.type) {
          case "2d":
            let w = 0;
            let h = 0;
            if (layer.width) {
              w = layer.width;
            } else {
              w = window.innerWidth;
            }
            if (layer.height) {
              h = layer.height;
            } else {
              h = window.innerHeight;
            }
            this._oge._graph.setSize(name, w, h);
            break;
        }
      }
    }
  }
}

module.exports = {
  _init: function (oge) {
    this.oge = oge;
    this.oge._scenes = {};
    for (var n in fns) {
      this.oge[n] = fns[n];
    }
    this.oge.Scene = Scene;
    Object.assign(this.oge.Scene.prototype, { _oge: this.oge });

    this.oge._em.on("project_load", function (proj) {
      this._scenes = {};
      this._graph.destroyAll();
      if (proj.scenes) {
        let list = proj.scenes;
        for (var name in list) {
          let scene = list[name];
          if (scene[0] !== "/") {
            scene = "/" + scene;
          }
          let path = proj.path;
          scene = this.requireUncached(path + scene);
          scene.name = name;
          scene.path = path;
          scene = this.regScene(scene);

          if (scene.load) {
            scene.load();
          }
        }
      }
    });

    this.oge._em.on("start", function () {
      if (!this.loadScene(this.project.defaultScene)) {
        global.console.error("Неверное название defaultScene");
      }
    });

    this.oge._em.on("before_draw", function () {
      if (this.buffer.scene._draw) {
        this.buffer.scene._draw();
      }
    });

    this.oge._em.on("update", function () {
      if (this.buffer.scene._update) {
        this.buffer.scene._update();
      }
    });

    this.oge._em.on("after_update", function () {
      if (this.buffer.scene._updateLayers) {
        this.buffer.scene._updateLayers();
      }
    });
  },
};
