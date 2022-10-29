class Obj {
  constructor(info) {
    let inf = {
      name: "object",
      width: 0,
      height: 0,
      _draw: function () {
        if (this.sprite) {
          this.drawSprite({
            sprite: this.sprite,
            x: this.x,
            y: this.y,
          });
        }
      },
    };

    info = Object.assign(inf, info);
    for (var k in info) {
      this[k] = info[k];
    }
    return this;
  }
}

module.exports = {
  _init: function (oge) {
    this.oge = oge;
    this.oge._objects = {};
    this.oge.regObj = function (info) {
      if (!info) {
        return false;
      }
      if (!info.name) {
        return false;
      }
      this._objects[info.name] = new this.Obj(info);
      return this._objects[info.name];
    };
    this.oge.Obj = Obj;
    Object.assign(this.oge.Obj.prototype, { _oge: this.oge });

    this.oge._em.on("project_load", function (proj) {
      this._objects = {};
      if (proj.objects) {
        let list = proj.objects;
        for (var name in list) {
          let obj = list[name];
          if (obj[0] !== "/") {
            obj = "/" + obj;
          }
          obj = proj.path + obj;
          obj = this.requireUncached(obj);
          obj.name = name;
          this.regObj(obj);
        }
      }
    });
  },
};
