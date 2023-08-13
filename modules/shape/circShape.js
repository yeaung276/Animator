import { getMinMaxFromEditPoints } from "../helper.js";
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

  onEdit() {
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(this.currentEditPoints);
    this.currentEditPoints = [
      { x: (minX + maxX) / 2, y: minY },
      { x: (minX + maxX) / 2, y: maxY },
      { x: minX, y: (minY + maxY) / 2 },
      { x: maxX, y: (minY + maxY) / 2 },
    ];
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices) {
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(vertices);
    ellipse((maxX + minX) / 2, (maxY + minY) / 2, maxX - minX, maxY - minY);
  }
}
