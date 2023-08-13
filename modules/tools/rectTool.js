import RectShape from "../shape/rectShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class RectTool extends BaseToolClass {
  name = "RectTool";

  icon = "assets/rectangle.png";

  tooltip = "draw a rectangle on the screen";

  constructor() {
    super();
  }

  // use polymorphism to overwrite the unimplemented createPreview function
  createPreview(x, y, x_e, y_e) {
    push();
    fill(0, 0, 0, 0);
    stroke(1);
    drawingContext.setLineDash([5, 5]);
    rect(x, y, x_e - x, y_e - y);
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    return new RectShape(uuid(), x, y, x_e, y_e);
  }
}
