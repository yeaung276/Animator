import BaseShapeClass from "./BaseShapeClass.js";

export default class LineShape extends BaseShapeClass {
  constructor(name, x, y, x_e, y_e) {
    super(name, [
      { x, y },
      { x: x_e, y: y_e },
    ]);
  }

  drawShape(vertices) {
    beginShape();
    vertices.forEach((v) => {
      vertex(v.x, v.y);
    });
    endShape();
  }
}
