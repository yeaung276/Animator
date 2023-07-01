// All shape that will be draw to the canvas must extend this base class
// This class hold all common code that all shape class inherit
export default class BaseShapeClass {
  name;

  vertices = [];

  // x, y is the center of the shape
  // h, w are effect width, height of the bounding box
  constructor(name, vertices) {
    this.name = name;
    this.vertices = vertices;
    const xinf = this.getX();
    const yinf = this.getY();
    this.positionX = xinf.x;
    this.positionY = yinf.y;
    this.height = yinf.height;
    this.width = xinf.width;
  }

  getX() {
    // find min and max vertex point horizontally and calculate
    // x and width
    var max = 0;
    var min = 99999;
    this.vertices.forEach((v) => {
      min = Math.min(min, v.x);
      max = Math.max(max, v.x);
    });
    return {
      x: (min + max) / 2,
      width: max - min,
    };
  }

  getY() {
    var max = 0;
    var min = 99999;
    this.vertices.forEach((v) => {
      min = Math.min(min, v.y);
      max = Math.max(max, v.y);
    });
    return {
      y: (min + max) / 2,
      height: max - min,
    };
  }

  // logics for drawing the shape in normal display mode
  drawShape() {
    throw Error("Not implemented");
  }

  // function to check the object is clicked or not
  isClicked(x, y) {
    const { x: posX, width } = this.getX();
    const { y: posY, height } = this.getY();

    if (
      posX - width / 2 < x &&
      posX + width / 2 > x &&
      posY - height / 2 < y &&
      posY + height / 2 > y
    ) {
      return true;
    }
    return false;
  }

  // draw the hightlighted bounding box
  highLight() {
    const { x: posX, width } = this.getX();
    const { y: posY, height } = this.getY();
    push();
    drawingContext.setLineDash([5, 5]);
    fill(0, 0, 0, 0);
    rect(
      posX - width / 2,
      posY - height / 2,
      width,
      height
    );
    pop();
  }

  // this function is called at each drawing frame
  draw(isSelected) {
    if (isSelected) {
      this.highLight();
      push();
      fill(0);
      // draw the edit points if the shape is selected for edit
      this.vertices.forEach((v) => {
        rect(v.x - 5, v.y - 5, 10, 10);
      });
      pop();
    }
    // draw the shape
    this.drawShape();
  }

  record(vertices) {
    this.vertices = vertices;
  }
}
