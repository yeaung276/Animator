// All shape that will be draw to the canvas must extend this base class
// This class hold all common code that all shape class inherit
export default class BaseShapeClass {
  name;

  currentEditPoints = [];

  currentProperties = {
    strokeStyle: "solid",
    strokeWeight: 1,
    strokeColor: [0, 0, 0],
    fillColor: [0, 0, 0],
    opacity: 255,
  };

  keyFrames = {};

  // x, y is the center of the shape
  // h, w are effect width, height of the bounding box
  constructor(name, vertices) {
    this.name = name;
    this.currentEditPoints = vertices;
  }

  getX() {
    // find min and max vertex point horizontally and calculate
    // x and width
    var max = 0;
    var min = 99999;
    this.currentEditPoints.forEach((v) => {
      min = Math.min(min, v.x);
      max = Math.max(max, v.x);
    });
    return {
      x: (min + max) / 2,
      width: max - min,
    };
  }

  getY() {
    // find min and max vertex point vertically and calculate
    // y and height
    var max = 0;
    var min = 99999;
    this.currentEditPoints.forEach((v) => {
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
    rect(posX - width / 2, posY - height / 2, width, height);
    pop();
  }

  // calculate editPoint at Each timeframe
  getEditPoints(t) {
    const timeTicks = Object.keys(this.keyFrames).map((x) => parseInt(x, 10));
    timeTicks.sort((a, b) => a - b);
    const nextTickIndex = timeTicks.findIndex(
      (x) => parseInt(x, 10) > parseInt(t)
    );
    const nextTick = timeTicks[nextTickIndex];
    const previousTick = timeTicks[nextTickIndex - 1];

    const interPolatedVertices = [];
    for (var i = 0; i < this.currentEditPoints.length; i++) {
      const prev = this.keyFrames[previousTick];
      const next = this.keyFrames[nextTick];
      if (!next) {
        const vertex = {
          x: this.keyFrames[timeTicks[timeTicks.length - 1]].vertices[i].x,
          y: this.keyFrames[timeTicks[timeTicks.length - 1]].vertices[i].y,
        };
        interPolatedVertices.push(vertex);
        continue;
      }
      const vertex = {
        x: map(
          t,
          previousTick,
          nextTick,
          prev?.vertices[i].x,
          next?.vertices[i].x
        ),
        y: map(
          t,
          previousTick,
          nextTick,
          prev?.vertices[i].y,
          next?.vertices[i].y
        ),
      };
      interPolatedVertices.push(vertex);
    }
    return interPolatedVertices;
  }

  // calculate properties at each timeframe
  getProperties(t) {
    const timeTicks = Object.keys(this.keyFrames).map((x) => parseInt(x, 10));
    timeTicks.sort((a, b) => a - b);
    const nextTickIndex = timeTicks.findIndex(
      (x) => parseInt(x, 10) > parseInt(t)
    );
    const nextTick = timeTicks[nextTickIndex];
    const previousTick = timeTicks[nextTickIndex - 1];

    let interPolatedProperties = {};
    const prev = this.keyFrames[previousTick];
    const next = this.keyFrames[nextTick];
    if (!next) {
      interPolatedProperties =
        this.keyFrames[timeTicks[timeTicks.length - 1]].properties;
    } else {
      interPolatedProperties = {
        strokeWeight: map(
          t,
          previousTick,
          nextTick,
          prev?.properties.strokeWeight,
          next?.properties.strokeWeight
        ),
        strokeColor: [
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.strokeColor[0],
            next?.properties.strokeColor[0]
          ),
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.strokeColor[1],
            next?.properties.strokeColor[1]
          ),
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.strokeColor[2],
            next?.properties.strokeColor[2]
          ),
        ],
        fillColor: [
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.fillColor[0],
            next?.properties.fillColor[0]
          ),
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.fillColor[1],
            next?.properties.fillColor[1]
          ),
          map(
            t,
            previousTick,
            nextTick,
            prev?.properties.fillColor[2],
            next?.properties.fillColor[2]
          ),
        ],
        opacity: map(
          t,
          previousTick,
          nextTick,
          prev?.properties.opacity,
          next?.properties.opacity
        ),
      };
    }
    return interPolatedProperties;
  }

  // this function is called at each drawing frame
  draw(isSelected) {
    if (isSelected) {
      this.highLight(this.currentEditPoints);
    }
    // draw the shape
    push();
    stroke(
      ...this.currentProperties.strokeColor,
      this.currentProperties.opacity
    );
    strokeWeight(this.currentProperties.strokeWeight);
    fill(...this.currentProperties.fillColor, this.currentProperties.opacity);
    switch (this.currentProperties.strokeStyle) {
      case "dash":
        drawingContext.setLineDash([15, 5]);
        break;
      case "dotted":
        drawingContext.setLineDash([3, 3]);
        break;
      default:
        drawingContext.setLineDash([]);
    }
    this.drawShape(this.currentEditPoints);
    pop();
  }
}
