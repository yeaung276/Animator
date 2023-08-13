import TrigShape from "../shape/trigShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class TrigTool extends BaseToolClass {
  name = "TrigTool";

  icon = "assets/triangle.png";

  tooltip =
    "Draw a triangle on the screen. Make sure to unselect the shape if a shape is selected before start drawing";

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
    beginShape();
    vertex((x + x_e) / 2, Math.min(y, y_e));
    vertex(Math.min(x, x_e), Math.max(y, y_e));
    vertex(Math.max(x, x_e), Math.max(y, y_e));
    vertex((x + x_e) / 2, Math.min(y, y_e));
    endShape();
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    return new TrigShape(uuid(), x, y, x_e, y_e);
  }
}
