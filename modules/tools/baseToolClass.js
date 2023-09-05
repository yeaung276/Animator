// This class hold common code that all tool class inherit
// All tool class must extend this base class
export default class BaseToolClass {
  // name of the tool
  name;

  // icon to show in the side bar
  icon;

  // function to create preview object while drawing with mouse(before mouse release)
  createPreview(startX, startY, endX, endY) {
    throw Error("Function not implemented");
  }

  // function to create the perticular shape object after drawing end
  createShape(startX, startY, endX, endY) {
    throw Error("Function not implemented");
  }

  // this function will be called at the mouse clicked
  onDrawStart(posX, posY) {
    this.startX = posX;
    this.startY = posY;
  }

  // this function will be called while mouse is clicked
  onDraw(posX, posY) {
    this.createPreview(this.startX, this.startY, posX, posY);
  }

  // this function will be called when the mouse click is released
  // should return Shape object on draw end;
  onDrawEnd(posX, posY) {
    // will only create shape if start and end have signifient difference
    // this was necessary to prevent from creating shapes from just clicking
    var shape = null;
    if (dist(this.startX, this.startY, posX, posY) > 10) {
      shape = this.createShape(this.startX, this.startY, posX, posY);
    }
    this.startX = null;
    this.startY = null;
    return shape;
  }
}
