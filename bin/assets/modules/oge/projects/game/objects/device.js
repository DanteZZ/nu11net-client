module.exports = {
  sprite: "device_pc",
  status: -1,
  mousehover: false,
  clickable: true,
  contextable: true,
  statable: true,
  contextmenu: {
    poweron: {
      label: "Включить",
    },
    poweroff: {
      label: "Выключить",
    },
  },
  title: "",
  _contextClick: function (item) {
    if (this.contextmenu[item].disabled) {
      return false;
    }
    switch (item) {
      case "poweron":
        this.dev.__powerON();
        break;
      case "poweroff":
        this.dev.__powerOFF();
        break;
      default:
        let cm = this._getContextMenu();
        if (cm[item] && !cm[item].disabled && cm[item].func) {
          cm[item].func.apply(this.dev);
        }
        break;
    }
  },
  _getContextMenu: function () {
    if (this.dev.__contextmenu) {
      return Object.assign(this.contextmenu, this.dev.__contextmenu);
    } else {
      return this.contextmenu;
    }
  },
  _create: function () {
    this.setSpriteSpeed(0);
    if (this._oge.isSprite("device_" + this.dev.__type)) {
      this.setSprite("device_" + this.dev.__type);
    } else {
      // Здесь надо будет поставить общепринятый спрайт при не нахождении
    }
    this.title = this.dev.__name;
    let spr = this._oge.spriteInfo(this.sprite);
    this.createCollider({
      name: "collider",
      x: -spr.center_x,
      y: -spr.center_y,
      width: spr.width,
      height: spr.height,
    });
    if (typeof this.dev.contextable !== "undefined") {
      this.contextable = this.dev.contextable;
    }
    if (typeof this.dev.clickable !== "undefined") {
      this.clickable = this.dev.clickable;
    }
    if (typeof this.dev.statable !== "undefined") {
      this.statable = this.dev.statable;
    }
  },
  _update: function () {
    if (this.status !== this.dev._status) {
      this.status = this.dev._status;
      this.setSpriteFrame(this.status);
      switch (this.dev._status) {
        case 0:
          this.title = this.dev.__name + (this.statable ? " [Выкл.]" : "");
          this.contextmenu.poweron.disabled = false;
          this.contextmenu.poweroff.disabled = true;
          break;
        case 1:
          this.title = this.dev.__name + (this.statable ? " [Вкл.]" : "");
          this.contextmenu.poweron.disabled = true;
          this.contextmenu.poweroff.disabled = false;
          break;
      }
    }
  },

  _click: function () {
    let displays = this.dev._getInterfacesByType("display");
    if (Object.keys(displays).length) {
      global.lockgame = true;
      for (var k in displays) {
        global.deviceDisplay = displays[k];
        break;
      }
    }
  },
  _draw: function () {
    if (this.sprite) {
      if (this.mousehover) {
        //let ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
        //ctx.shadowColor = 'red';
        //ctx.shadowBlur = 15;
        this.drawSprite({
          sprite: this.sprite,
          x: this.x,
          y: this.y,
          filter: "drop-shadow(0px 0px 14px rgba(0,178,255,0.75))",
        });
        //ctx.shadowColor = 'transparent';
        //ctx.shadowBlur = 0;
      } else {
        this.drawSprite({
          sprite: this.sprite,
          x: this.x,
          y: this.y,
          opacity: 1,
        });
      }
    }
  },
};
