import ImageShape from "../shape/imageShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class ImageTool extends BaseToolClass {
  name = "ImageTool";

  icon = "assets/image.png";

  tooltip =
    "Draw an image the screen. You can edit the image in the properties panel. Make sure to unselect the shape if a shape is selected before start drawing";

  defaultImageURL = "assets/image.png";

  defaultImage = null;

  constructor() {
    super();
    loadImage(this.defaultImageURL, (img) => {
      this.defaultImage = img;
    });
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
    image(this.defaultImage, x, y, x_e - x, y_e - y);
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    return new ImageShape(uuid(), x, y, x_e, y_e, this.defaultImageURL);
  }
}
