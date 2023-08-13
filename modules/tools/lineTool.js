import LineShape from "../shape/lineShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class LineTool extends BaseToolClass {
  name = "LineTool";

  icon = "assets/lineTo.jpg";

  tooltip =
    "Draw a line on the screen. Make sure to unselect the shape if a shape is selected before start drawing";

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
    line(x, y, x_e, y_e);
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    return new LineShape(uuid(), x, y, x_e, y_e);
  }
}
