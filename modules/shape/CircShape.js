import BaseShapeClass from "./BaseShapeClass.js";

export default class CircShape extends BaseShapeClass {
  constructor(name, x, y, x_e, y_e) {
    super(name, [
      { x: (x + x_e) / 2, y: Math.min(y, y_e) },
      { x: (x + x_e) / 2, y: Math.max(y, y_e) },
      { x: Math.min(x, x_e), y: (y + y_e) / 2 },
      { x: Math.max(x, x_e), y: (y + y_e) / 2 },
    ]);
  }

  getMinMax(vertices) {
    let maxX = 0;
    let minX = 9999;
    let maxY = 0;
    let minY = 9999;
    for (var i = 0; i < vertices.length; i++) {
      maxX = Math.max(maxX, vertices[i].x);
      minX = Math.min(minX, vertices[i].x);
      maxY = Math.max(maxY, vertices[i].y);
      minY = Math.min(minY, vertices[i].y);
    }
    return { maxX, maxY, minX, minY };
  }

  onEdit() {
    const { maxX, maxY, minX, minY } = this.getMinMax(this.currentEditPoints);
    this.currentEditPoints = [
      { x: (minX + maxX) / 2, y: minY },
      { x: (minX + maxX) / 2, y: maxY },
      { x: minX, y: (minY + maxY) / 2 },
      { x: maxX, y: (minY + maxY) / 2 },
    ];
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices) {
    const { maxX, maxY, minX, minY } = this.getMinMax(vertices);
    ellipse((maxX + minX) / 2, (maxY + minY) / 2, maxX - minX, maxY - minY);
  }
}
