import BaseShapeClass from "./baseShapeClass.js";

export default class LineShape extends BaseShapeClass {
  type = "line";
  
  constructor(name, x, y, x_e, y_e) {
    super(name, [
      { x, y },
      { x: x_e, y: y_e },
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
