module.exports = {
  sprite: "cursor",
  hoverobj: null,
  menu: {
    opened: false,
    obj: null,
    hover: null,

    lheight: 24,
    fsize: 24,
    width: 0,
    height: 0,
    padding: 8,
  },
  _create: function () {
    global.cursor = this;
    this.createCollider({
      name: "collider",
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    });
    this._ctx = this._oge._graph.getCanvas(this._oge.buffer.defaultLayer);
    this._gui = this._oge._graph.getCanvas("gui");
  },
  _update: function () {
    this.x = global.mouse_x + this._ctx.offset_x;
    this.y = global.mouse_y + this._ctx.offset_y;
    this.checkHover();

    if (this._oge.onMousePress(1)) {
      //LMB
      if (this.menu.opened) {
        if (this.menu.hover) {
          this.menu.obj._contextClick(this.menu.hover);
        }
        this.closeContextMenu();
      } else {
        if (this.hoverobj && this.hoverobj.clickable) {
          this.hoverobj._click();
        }
      }
    }

    if (this._oge.onMousePress(3)) {
      this.closeContextMenu();
      if (this.hoverobj && this.hoverobj.contextable) {
        this.openContextMenu(this.hoverobj);
      }
    }
  },
  openContextMenu: function (obj) {
    this.menu.opened = true;
    this.menu.obj = obj;
  },
  closeContextMenu: function () {
    this.menu.opened = false;
    this.menu.obj = null;
    this.menu.hover = null;
  },
  checkHover: function () {
    let cols = this.collideWith();

    if (this.hoverobj) {
      this.hoverobj.mousehover = false;
      this.hoverobj = null;
      global.hovertext = "";
    }

    if (cols) {
      cols[0].mousehover = true;
      this.hoverobj = cols[0];
      if (this.hoverobj.title) {
        global.hovertext = this.hoverobj.title;
      }
    }

    if (this.menu.opened) {
      this.menu.ox = this.menu.obj.x - this._ctx.offset_x;
      this.menu.oy = this.menu.obj.y - this._ctx.offset_y;

      let i = 0;
      this.menu.hover = null;
      for (var k in this.menu.obj._getContextMenu()) {
        let item = this.menu.obj._getContextMenu()[k];
        let twidth = this._gui.measureText(item.label).width;
        if (twidth > this.menu.width) {
          this.menu.width = twidth;
        }
        if (
          this._oge._onBoxMeeting(
            {
              x: this.x - this._ctx.offset_x,
              y: this.y - this._ctx.offset_y,
              width: 1,
              height: 1,
            },
            {
              x: this.menu.ox,
              y: this.menu.oy + i * this.menu.lheight,
              width: twidth,
              height: this.menu.lheight,
            }
          )
        ) {
          this.menu.hover = k;
        }
        i++;
      }
      this.menu.height = i * this.menu.lheight;
    }
  },
  _draw: function () {
    if (this.menu.opened) {
      let i = 0;
      this._gui.fillStyle = "rgba(0,0,0,0.8)";
      this._gui.fillRect(
        this.menu.obj.x - this._ctx.offset_x - this.menu.padding,
        this.menu.obj.y - this._ctx.offset_y - this.menu.padding,
        this.menu.width + this.menu.padding * 2,
        this.menu.height + this.menu.padding * 2
      );

      this._gui.strokeStyle = "black";
      this._gui.lineWidth = 4;
      this._gui.font = "24px VGA";
      this._gui.textBaseline = "top";

      for (var k in this.menu.obj._getContextMenu()) {
        this._gui.fillStyle = "#FFFFFF";
        let item = this.menu.obj._getContextMenu()[k];

        if (k == this.menu.hover) {
          this._gui.fillStyle = "#57b5da";
        }
        if (item.disabled) {
          this._gui.fillStyle = "#909090";
        }
        this._gui.strokeText(
          item.label,
          this.menu.ox,
          this.menu.oy + this.menu.lheight * i
        );
        this._gui.fillText(
          item.label,
          this.menu.ox,
          this.menu.oy + this.menu.lheight * i
        );
        i++;
      }
    }

    if (this.sprite && !global.deviceDisplay) {
      // this.drawSprite({
      //   sprite: this.sprite,
      //   x: this.x - this._ctx.offset_x,
      //   y: this.y - this._ctx.offset_y,
      //   layer: "gui",
      // });
    }
  },
};
