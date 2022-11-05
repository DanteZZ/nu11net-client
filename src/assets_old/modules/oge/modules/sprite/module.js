let fns = {
  regSprite: function (info) {
    if (!info) {
      return false;
    }
    if (!info.name) {
      return false;
    }
    if (!info.src) {
      return false;
    }
    this._sprites[info.name] = new this.Sprite(info);
    this._sprites[info.name]._oge = this;
    return this._sprites[info.name];
  },
  isSprite: function (name) {
    if (this._sprites[name]) {
      return true;
    }
    return false;
  },
  spriteInfo: function (name) {
    if (this._sprites[name]) {
      return this._sprites[name];
    }
    return false;
  },
};

class Sprite {
  constructor(info) {
    let inf = {
      name: "sprite",
      width: 0,
      height: 0,
      original_width: 0,
      original_height: 0,
      frames: 1,
      center_x: 0,
      center_y: 0,
    };
    info = Object.assign(inf, info);
    for (var k in info) {
      this[k] = info[k];
    }
    this.image = info.src;

    return this;
  }
}

module.exports = {
  _init: function (oge) {
    this.oge = oge;
    this.oge._sprites = {};
    for (var n in fns) {
      this.oge[n] = fns[n];
    }
    this.oge.Sprite = Sprite;
    Object.assign(this.oge.Sprite.prototype, { _oge: this.oge });

    this.oge._em.on("before_load", function (proj) {
      this._sprites = {};
      let sprlist = [];
      if (proj.sprites) {
        let list = proj.sprites;
        for (var name in list) {
          let sprite = list[name];
          sprite.name = name;
          if (sprite.src[0] == "/") {
            sprite.src = sprite.src.substr(1);
          }
          sprite.src = proj.path + sprite.src;
          sprlist.push(sprite.src);
          this.regSprite(sprite);
        }
        this._rl.addToLoad(sprlist); // Resource Loading
      }
    });

    this.oge._em.on("project_load", function (proj) {
      for (var k in this._sprites) {
        let spr = this._sprites[k];
        spr.image = this._rl.get(spr.image); // Set images
        spr.original_width = spr.image.width;
        spr.original_height = spr.image.height;

        if (!spr.width) {
          spr.width = spr.original_width / spr.frames;
        }
        if (!spr.height) {
          spr.height = spr.original_height;
        }
      }
    });

    this.oge._em.on("after_init", function () {
      this.Instance.prototype.setSprite = function (sprite) {
        this.check__sprites();

        if (this._oge._sprites[sprite]) {
          this.sprite = sprite;
          if (this.__sprites[sprite]) {
            this.__sprites[sprite].frame = 0;
          }
        }
      };

      this.Instance.prototype.setSpriteSpeed = function (speed) {
        this.spriteSpeed = speed;
      };

      this.Instance.prototype.setSpriteFrame = function (sprite, frame = null) {
        this.check__sprites();
        if (frame === null) {
          frame = sprite;
          sprite = this.sprite;
        }
        if (this.__sprites[sprite]) {
          this.__sprites[sprite].frame = frame;
        } else {
          this.__sprites[sprite] = {
            frame: frame,
            lastFrameTime: Date.now(),
          };
        }
      };

      this.Instance.prototype.check__sprites = function () {
        if (!this.__sprites) {
          this.__sprites = {};
        }
        if (this.spriteSpeed == undefined) {
          this.spriteSpeed = 1;
        }
      };

      this.Instance.prototype.drawSprite = function (info) {
        this.check__sprites();

        inf = {
          sprite: false,
          layer: this._oge.buffer.defaultLayer,
          x: 0,
          y: 0,
          offset_x: 0,
          offset_y: 0,
          opacity: 1,
          filter: "",
        };

        info = Object.assign(inf, info);

        if (info.sprite.constructor !== Sprite) {
          if (this._oge._sprites[info.sprite]) {
            info.sprite = this._oge._sprites[info.sprite];
          } else {
            return false;
          }
        }

        if (!this.__sprites[info.sprite.name]) {
          this.__sprites[info.sprite.name] = {
            frame: 0,
            lastFrameTime: Date.now(),
          };
        }

        let spInf = this.__sprites[info.sprite.name];

        if (info.sprite.frames > 1) {
          if (this.spriteSpeed > 0 && info.sprite.speed > 0) {
            if (
              Date.now() >=
              spInf.lastFrameTime +
                1000 *
                  (info.sprite.speed / info.sprite.frames) *
                  this.spriteSpeed
            ) {
              if (spInf.frame == info.sprite.frames - 1) {
                spInf.lastFrameTime = Date.now();
                spInf.frame = 0;
              } else {
                spInf.lastFrameTime = Date.now();
                spInf.frame++;
              }
            }
          }
          info.offset_x = spInf.frame * info.sprite.width;
        }

        this.__sprites[info.sprite.name] = spInf;

        info.image = info.sprite.image;

        info.swidth = info.sprite.width;
        info.sheight = info.sprite.height;

        info.dwidth = info.sprite.width;
        info.dheight = info.sprite.height;

        info.x -= info.sprite.center_x;
        info.y -= info.sprite.center_y;

        if (this.rotation) {
          info.rotation = this.rotation;
        }

        info.canvas = info.layer;

        delete info.layer;
        return this._oge._graph.drawImage(info);
      };
    });
  },
};
