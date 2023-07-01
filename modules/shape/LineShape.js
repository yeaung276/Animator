import BaseShapeClass from "./BaseShapeClass.js";

export default class LineShape extends BaseShapeClass {
  constructor(name, x, y, x_e, y_e) {
    super(name, [
      { x, y },
      { x: x_e, y: y_e },
    ]);
  }

  drawShape() {
    push();
    stroke(1);
    beginShape();
    this.vertices.forEach((v) => {
      vertex(v.x, v.y);
    });
    endShape();
    pop();
    fill(0);
  }
}
