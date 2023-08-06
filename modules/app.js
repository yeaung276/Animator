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

    this.editor.selectedShape = this.selectedShape;
    this.editor.draw(this.animator.time);

    this.animator.selectedShape = this.selectedShape;
    this.animator.update();

    Object.values(this.shapes).forEach((obj) => {
      obj.draw(obj.name === this.selectedShape?.name);
    });

    // reset selected shape to null if it is being deleted
    if(this.shapes[this.selectedShape?.name] === undefined){
      this.selectedShape = null
    }
  }

  addShape(shape) {
    this.shapes[shape.name] = shape;
    this.animator.addShape(shape);
    // select and highlight the newest draw shape
    this.selectedShape = shape;
    // set values to editor panal
    this.editor.updatePropertiesValuesDisplay(this.selectedShape)
  }

  // life cycle methods
  onHover(posX, posY) {
    this.editor.onHover(posX, posY);
  }

  onMousePressed(posX, posY) {
    if (this.selectedShape) {
      // invoke editor press if there is selected shape
      this.editor.onPressed(posX, posY);
    } else if (this.toolbox?.selectedTool) {
      // invoke drawing code if drawing tool is selected and
      // there is no editing
      this.toolbox?.selectedTool?.onDrawStart(posX, posY);
    }
  }

  onMouseHold(posX, posY) {
    if (this.selectedShape) {
      // if there is shape selected, mouse drag means editing the shape
      this.editor.onDrag(posX, posY);
    } else if (this.toolbox?.selectedTool) {
      // invode drawing code if drawing tool is selected and
      // there is no editing
      this.toolbox?.selectedTool?.onDraw(posX, posY);
    }
  }

  onMouseRelease(posX, posY) {
    if (this.selectedShape) {
        this.editor.onRelease(posX, posY);
    } else if (this.toolbox?.selectTool) {
      const shape = this.toolbox?.selectedTool?.onDrawEnd(posX, posY);
      // if drawing tool create a shape, add it to the globe shape object
      shape && this.addShape(shape);
    }
  }

  onDoubleClicked(x, y) {
    // select shape on double clicked
    // get all the shape that was affected by the click and iterage throught on each subsequence click
    const shapes = Object.values(this.shapes)
      .filter((s) => s.isClicked(x, y, this.animator.time))
      .sort((x, y) => x.name.localeCompare(y.name));
    const selectedShapeIndex = shapes.findIndex(
      (shape) => shape.name === this.selectedShape?.name
    );
    this.selectedShape = shapes[selectedShapeIndex + 1];
    if(this.selectedShape){
      // set properties values to Properties/Editor panal
      this.editor.updatePropertiesValuesDisplay(this.selectedShape)
    }
  }
}
