import BaseShapeClass from "./baseShapeClass.js";

export default class RectShape extends BaseShapeClass {
  type = "rect";
  
  constructor(name, x, y, x_e, y_e) {
    const minX = Math.min(x, x_e);
    const maxX = Math.max(x, x_e);
    const minY = Math.min(y, y_e);
    const maxY = Math.max(y, y_e);
    super(name, [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ]);
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices) {
    beginShape();
    vertices.forEach((v) => {
      vertex(v.x, v.y);
    });
    vertex(vertices[0].x, vertices[0].y);
    endShape();
  }
}
