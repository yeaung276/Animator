import BaseShapeClass from "./BaseShapeClass.js";

export default class TrigShape extends BaseShapeClass {
  constructor(name, x, y, x_e, y_e) {
    super(name, [
      { x: (x + x_e) / 2, y: Math.min(y, y_e) },
      { x: Math.min(x, x_e), y: Math.max(y, y_e) },
      { x: Math.max(x, x_e), y: Math.max(y, y_e) },
    ]);
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices) {
    beginShape();
    vertices.forEach((v) => {
      vertex(v.x, v.y);
    });
    endShape();
  }
}
