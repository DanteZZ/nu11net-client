let fns = {
  createInstance: function (info) {
    if (!info) {
      return false;
    }
    if (!info.name) {
      return false;
    }

    let obj = this._objects[info.name];
    let iid = parseInt(this.buffer.lastInstId);
    this.buffer.instances[iid] = new this.Instance(info, obj, iid);

    if (this.buffer.instances[iid]._create !== undefined) {
      this.buffer.instances[iid]._create();
    }
    this.buffer.lastInstId++;
    return this.buffer.instances[iid];
  },
  findInstances: function (name) {
    let list = [];
    for (var k in this.buffer.instances) {
      if (!this.buffer.instances[k]) {
        continue;
      }
      if (this.buffer.instances[k].name == name) {
        list.push(this.buffer.instances[k]);
      }
    }

    if (list.length) {
      return list;
    } else {
      return false;
    }
  },
  __drawEvent: function () {
    for (var id in this.buffer.instances) {
      let instance = this.buffer.instances[id];
      if (!instance) {
        continue;
      }
      if (instance._draw) {
        instance._draw();
      }
    }
  },
  __updateEvent: function () {
    for (var id in this.buffer.instances) {
      let instance = this.buffer.instances[id];
      if (!instance) {
        continue;
      }

      instance.prevent_x = instance.x;
      instance.prevent_y = instance.y;

      if (instance._update) {
        instance._update();
      }
    }
  },
  __sortInstances: function () {
    this?.buffer?.instances?.sort(function (a, b) {
      return a?.depth - b?.depth;
    });
  },
  destroyInstance: function (inst) {
    if (inst.constructor == Instance) {
      this.buffer.instances[inst.id] = null;
      return true;
    } else if (this.buffer.instances[inst]) {
      this.buffer.instances[inst] = null;
      return true;
    } else {
      return false;
    }
  },
  destroyAllInstances: function () {
    if (this?.buffer?.instances?.length) {
      for (let num in this.buffer.instances) {
        this.buffer.instances[num] = null;
      }
    }
    return true;
  },
};

class Instance {
  constructor(inf, obj, id) {
    this.depth = 0;
    for (var par in obj) {
      if (typeof obj[par] == "object") {
        if (par == "_oge") {
          continue;
        }
        this[par] = JSON.parse(JSON.stringify(obj[par]));
      } else {
        this[par] = obj[par];
      }
    }
    for (var par in inf) {
      this[par] = inf[par];
    }
    this.id = id;
  }

  destroy() {
    this._oge.buffer.instances.forEach((e, i) => {
      if (e == this) {
        this._oge.buffer.instances.splice(i, 1);
      }
    });
  }
}

module.exports = {
  _init: function (oge) {
    this.oge = oge;
    this.oge.buffer.instances = [];
    this.oge.buffer.lastInstId = 0;
    for (var n in fns) {
      this.oge[n] = fns[n];
    }
    this.oge.Instance = Instance;
    Object.assign(this.oge.Instance.prototype, { _oge: this.oge });

    this.oge._em.on("project_load", function () {
      this.buffer.instances = [];
      this.buffer.lastInstId = 0;
    });

    this.oge._em.on("before_draw", this.oge.__sortInstances);
    this.oge._em.on("update", this.oge.__updateEvent);
    this.oge._em.on("draw", this.oge.__drawEvent);
  },
};
