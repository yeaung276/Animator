import DrawRecordShape from "../shape/drawRecordShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class DrawRecordTool extends BaseToolClass {
  name = "DrawRecordTool";

  icon = "assets/pencil.png";

  tooltip =
    "This will record the whatever you are drawing in realtime and replay exact drawing when you play animation. Shapes produced by this tool are not editable.";

  record = [];

  constructor() {
    super();
  }

  // polymorph onStartDraw function of BaseToolClass
  onDrawStart(posX, posY) {
    super.onDrawStart(posX, posY);
    this.record = [];
    this.currentTime = 0;
    this.startTime = window.app.animator.time;
  }

  // polymorph the onDraw function of BaseToolClass
  onDraw(posX, posY) {
    super.onDraw(posX, posY);
    if(dist(this.startX, this.startY, posX, posY) > 10){
        this.currentTime += deltaTime;
        this.record.push({ x: posX, y: posY, t: this.currentTime });
        /* keep progressing animator time bar while the shape is recording
         * need to access from global app object because changing animator from tool class
         * is exceptional case
         * Design Violation: should not globally edit the animator from tool class
         */
        window.app.animator.advanceTime();
    }
  }

  // use polymorphism to overwrite the unimplemented createPreview function
  createPreview(x, y, x_e, y_e) {
    push();
    fill(0, 0, 0, 0);
    stroke(1);
    beginShape();
    this.record.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape();
    pop();
  }

  // use polymorphism to overwrite the unimplemented createShape function
  createShape(x, y, x_e, y_e) {
    const shape = new DrawRecordShape(uuid(), this.record);
    // create extra keyframe
    // Design Violation: shape should not touch keyFrame properties, it is responsibility of the animator class
    shape.keyFrames[parseInt(this.startTime)] = {
      vertices: shape.currentEditPoints,
      properties: shape.currentProperties,
    };
    return shape;
  }
}
