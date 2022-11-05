module.exports = {
  sprite: "hero_right",
  speed: 200,
  collide_with: null,
  _create: function () {
    this.createCollider({
      name: "collider",
      width: 128,
      height: 280,
      x: -64,
      y: -260,
    });
    this.setSpriteSpeed(0);

    global.hero = this;
    this._oge.buffer.camera.point = this;
  },

  _update: function () {
    if (this._oge.onKeyHold(68)) {
      this.x += parseInt(this.speed * deltaTime * 10);
    }
    if (this._oge.onKeyHold(65)) {
      this.x -= parseInt(this.speed * deltaTime * 10);
    }

    if (this._oge.onKeyPress(68)) {
      this.setSprite("hero_right");
      this.setSpriteSpeed(1);
    }
    if (this._oge.onKeyPress(65)) {
      this.setSprite("hero_left");
      this.setSpriteSpeed(1);
    }

    if (this._oge.onKeyRelease(68)) {
      this.setSprite("hero_right");
      this.setSpriteSpeed(0);
    }
    if (this._oge.onKeyRelease(65)) {
      this.setSprite("hero_left");
      this.setSpriteSpeed(0);
    }

    if (this.onCollide("wall")) {
      this.x = this.prevent_x;
      this.y = this.prevent_y;
    }
  },

  _draw: function () {
    //this.drawColliders();
  },
};
