import Animator from "./animator.js";
import Editor from "./editor.js";
import LineShape from "./shape/LineShape.js";
import Toolbox from "./toolbox.js";
import BasicShape from "./tools/basicShapeTool.js";
import Controller from "./controller.js";

export default class App {
  shapes = {};

  selectedShape = null;

  constructor() {
    this.content = $("#content");
    this.toolbox = new Toolbox();
    this.animator = new Animator(this.shapes);
    this.editor = new Editor(this.animator);
    this.controller = new Controller();
  }

  setup() {
    this.toolbox.addTool(new BasicShape());
    this.canvas = createCanvas(this.content.width(), this.content.height());
    this.canvas.parent("content");

    this.animator.setup();

    this.controller.setup(this.canvas);
    this.controller.onMousePressed((x, y) => this.onMousePressed(x, y));
    this.controller.onMouseReleased((x, y) => this.onMouseRelease(x, y));
    this.controller.onMouseDragged((x, y) => this.onMouseHold(x, y));
    this.controller.onDoubleClicked((x, y) => this.onDoubleClicked(x, y));
    this.controller.onHover((x, y) => this.onHover(x, y));
  }

  draw() {
    this.controller.update();

    if (this.selectedShape) {
      this.editor.selectedShape = this.selectedShape;
      this.editor.draw(this.animator.time);
    }
    // animator logics
    this.animator.selectedShape = this.selectedShape;
    this.animator.update();

    Object.values(this.shapes).forEach((obj) => {
      obj.draw(obj.name === this.selectedShape?.name);
    });
  }

  addShape(shape) {
    this.shapes[shape.name] = shape;
    this.animator.addShapeToAnimatorBar(shape);
    // select and highlight the newest draw shape
    this.selectedShape = shape;
  }

  // life cycle methods
  onHover(posX, posY) {
    this.editor.hover(posX, posY);
  }

  onMousePressed(posX, posY) {
    if (this.selectedShape) {
      // invoke editor press if there is selected shape
      this.editor.onPressed(posX, posY);
    }
    if (this.toolbox?.selectedTool && !this.editor.isEditing) {
      // invoke drawing code if drawing tool is selected and
      // there is no editing
      this.toolbox?.selectedTool?.onDrawStart(posX, posY);
    }
  }

  onMouseHold(posX, posY) {
    if (this.selectedShape && this.editor.isEditing) {
      // if there is shape selected, mouse drag means editing the shape
      this.editor.onDrag(posX, posY);
    }
    if (this.toolbox?.selectedTool && !this.editor.isEditing) {
      // invode drawing code if drawing tool is selected and
      // there is no editing
      this.toolbox?.selectedTool?.onDraw(posX, posY);
    }
  }

  onMouseRelease(posX, posY) {
    if (this.toolbox?.selectTool && !this.editor.isEditing) {
      const shape = this.toolbox?.selectedTool?.onDrawEnd(posX, posY);
      // if drawing tool create a shape, add it to the globe shape object
      shape && this.addShape(shape);
    }
    if (this.selectedShape) {
      this.editor.onRelease(posX, posY);
    }
  }

  onDoubleClicked(x, y) {
    // select shape on double clicked
    const shapes = Object.values(this.shapes)
      .filter((s) => s.isClicked(x, y, this.animator.time))
      .sort((x, y) => x.name.localeCompare(y.name));
    const selectedShapeIndex = shapes.findIndex(
      (shape) => shape.name === this.selectedShape?.name
    );
    this.selectedShape = shapes[selectedShapeIndex + 1];
  }

  // loadExample(){
  //     const shape = new LineShape()
  //     shape.editPoints = [
  //         {x: 677.2428140299412, y: 173.11817839603034},
  //         {x: 706.252947141422, y: 129.0913037604618}
  //     ]
  //     shape.keyFrames = {
  //         0: [{x: 172.0663581231192, y: 125.08886061177378},{x: 172.0663581231192, y: 143.09985478086998}],
  //         17: [{x: 172.0663581231192, y: 125.08886061177378},{x: 168.06496045257012, y: 611.3857031773714}],
  //         34: [{x: 172.0663581231192, y: 125.08886061177378},{x: 654.234777424284, y: 390.25071921235684}],
  //         45: [{x: 172.0663581231192, y: 125.08886061177378},{x: 706.252947141422, y: 129.0913037604618}],
  //         60: [{x: 454.1648938968297, y: 447.28553408116153},{x: 706.252947141422, y: 129.0913037604618}],
  //         72: [{x: 677.2428140299412, y: 173.11817839603034},{x: 706.252947141422, y: 129.0913037604618}]
  //     }
  //     shape.name = 'example'
  //     this.shapes['example'] = shape
  //     this.animator.addShapeToAnimatorBar(shape)
  // }
}
