module.exports = {
  sprite: "wall",
  _create: function () {
    this.createCollider({
      name: "collider",
      width: 96,
      height: 96,
      x: 0,
      y: 0,
    });
  },
  _draw: function () {
    // this.drawColliders();
  },
};
