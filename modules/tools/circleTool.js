import CircShape from "../shape/circShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class CircTool extends BaseToolClass {
  name = "CircTool";

  icon = "assets/circle.png";

  tooltip =
    "Draw circle and ellipse on the screen. Make sure to unselect the shape if a shape is selected before start drawing";

  constructor() {
    super();
  }

  // use polymorphism to overwrite the unimplemented createPreview function
  createPreview(x, y, x_e, y_e) {
    push();
    fill(0, 0, 0, 0);
    stroke(1);
    push();
    drawingContext.setLineDash([5, 5]);
    rect(x, y, x_e - x, y_e - y);
    pop();
    ellipse((x + x_e) / 2, (y + y_e) / 2, Math.abs(x - x_e), Math.abs(y - y_e));
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    return new CircShape(uuid(), x, y, x_e, y_e);
  }
}
