module.exports = {
  sprite: "table",
  _draw: function () {
    if (this.sprite) {
      this.drawSprite({
        sprite: this.sprite,
        x: this.x,
        y: this.y,
      });
    }
    //this.drawColliders();
  },
};
