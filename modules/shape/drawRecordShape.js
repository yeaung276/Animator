import { TICK_PER_MS } from "../animator.js";
import { getMinMaxFromEditPoints } from "../helper.js";
import BaseShapeClass from "./baseShapeClass.js";

export default class DrawRecordShape extends BaseShapeClass {
  type = "drawRecord";

  points = [];

  constructor(name, points) {
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(points);
    const x_mid = (maxX + minX) / 2;
    const y_mid = (maxY + minY) / 2;
    super(name, [{ x: x_mid, y: y_mid }]);
    this.points = points.map((p) => ({
      ...p,
      x: p.x - x_mid,
      y: p.y - y_mid,
    }));
  }

  // use polymorphism to overwrite hightlight logic
  highLight() {
    // calculate area to highlight
    const { x, y } = this.currentEditPoints[0];
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(this.points);
    push();
    drawingContext.setLineDash([5, 5]);
    fill(0, 0, 0, 0);
    rect(x + minX, y + minY, maxX - minX, maxY - minY);
    pop();
  }

  // use polymorphism to overwrite isClick logic
  isClicked(x, y) {
    // calculate is the click is associated with the shape
    const { x: c_x, y: c_y } = this.currentEditPoints[0];
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(this.points);

    if (c_x + minX < x && maxX + c_x > x && minY + c_y < y && maxY + c_y > y) {
      return true;
    }
    return false;
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices, time) {
    if (vertices) {
      // calculate the time in the animation bar and converted to milisecond that shape undestand
      const progress =
        (time - Object.keys(this.keyFrames).sort((a, b) => a - b)[0]) /
        TICK_PER_MS;
      const { x: c_x, y: c_y } = vertices[0];
      noFill();
      beginShape();
      this.points
        // filter out the points based on current time and point's recorded time
        .filter((x) => x.t < progress)
        .forEach((p) => vertex(p.x + c_x, p.y + c_y));
      endShape();
    }
  }

  // custom serilization logics

  fromSaveFile(obj){
    super.fromSaveFile(obj)
    this.points = obj.points
  }

  toJsonObj(){
    return {
      ...super.toJsonObj(),
      points: this.points,
    }
  }
}
