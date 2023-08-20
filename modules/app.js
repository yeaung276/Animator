import Animator from "./animator.js";
import Editor from "./editor.js";
import Toolbox from "./toolbox.js";
import Controller from "./controller.js";
import LineTool from "./tools/lineTool.js";
import RectTool from "./tools/rectTool.js";
import TrigTool from "./tools/triangleTool.js";
import CircTool from "./tools/circleTool.js";
import ImageTool from "./tools/imageTool.js";
import DrawRecordTool from "./tools/drawRecordTool.js";
import { getShapeBySaveObject } from "./helper.js";

export default class App {
  shapes = {};

  displayOrder = {
    keys: [],
  };

  selectedShape = null;

  constructor() {
    this.content = $("#content");
    this.toolbox = new Toolbox();
    this.animator = new Animator(this.shapes, this.displayOrder);
    this.editor = new Editor(this.animator);
    this.controller = new Controller();
  }

  setup() {
    this.toolbox.addTool(new CircTool());
    this.toolbox.addTool(new LineTool());
    this.toolbox.addTool(new TrigTool());
    this.toolbox.addTool(new RectTool());
    this.toolbox.addTool(new ImageTool());
    this.toolbox.addTool(new DrawRecordTool());
    this.canvas = createCanvas(this.content.width(), this.content.height());
    this.canvas.parent("content");

    this.animator.setup();

    this.controller.setup(this.canvas);
    this.controller.onMousePressed((x, y) => this.onMousePressed(x, y));
    this.controller.onMouseReleased((x, y) => this.onMouseRelease(x, y));
    this.controller.onMouseDragged((x, y) => this.onMouseHold(x, y));
    this.controller.onDoubleClicked((x, y) => this.onDoubleClicked(x, y));
    this.controller.onHover((x, y) => this.onHover(x, y));

    // attach onClick events for the button in the ribbon
    $("#clear-btn").on("click", () => {
      this.clearShapes();
    });
    $("#save-proj").on("click", () => {
      this.saveProject();
    });
    $("#load-proj").on("click", () => {
      // https://stackoverflow.com/questions/31693296/is-it-possible-to-make-a-button-as-file-upload-button
      $("#load-proj-file").click()
    })
    $("#load-proj-file").on('change', (e) => {
      if(e.target.files){
        this.loadProject(e.target.files[0])
      }
    })
  }

  draw() {
    this.controller.update();

    this.editor.selectedShape = this.selectedShape;
    this.editor.draw(this.animator.time);

    this.animator.selectedShape = this.selectedShape;
    this.animator.update();

    // draw the shape based on the display order specified by the animator panal
    this.displayOrder.keys.forEach((key) => {
      const obj = this.shapes[key];
      obj?.draw(obj.name === this.selectedShape?.name, this.animator.time);
    });

    // reset selected shape to null if it is being deleted
    if (this.shapes[this.selectedShape?.name] === undefined) {
      this.selectedShape = null;
    }
  }

  addShape(shape) {
    this.shapes[shape.name] = shape;
    this.displayOrder.keys.push(shape.name);
    this.animator.addShape(shape);
    // select and highlight the newest draw shape
    this.selectedShape = shape;
    // set values to editor panal
    this.editor.updatePropertiesValuesDisplay(this.selectedShape);
  }

  clearShapes() {
    // clear all the drawn shapes from the canvas
    this.displayOrder = { keys: [] };
    this.selectedShape = null;
    this.animator.clearShapes();
    Object.keys(this.shapes).forEach((s) => {
      delete this.shapes[s];
    });
  }
  // project control methods
  saveProject() {
    // save the current shapes, searialize using json and save the file
    const project = {
      shapes: Object.keys(this.shapes).reduce((p,v) => ({...p,[v]: this.shapes[v].toJsonObj()}),{}),
      displayOrder: this.displayOrder,
    };
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    try{
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(project));
      var dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "project.json");
      dlAnchorElem.click();
    } catch(e){
      alert("Error saving project file.")
      console.error(e)
    }
  }

  loadProject(file){
    // read the file using FileReader
    // https://web.dev/read-files
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      try{
        const project = JSON.parse(event.target.result)
        this.displayOrder = project.displayOrder
        Object.keys(project.shapes).forEach((s) => {
          this.shapes[s] = getShapeBySaveObject(project.shapes[s])
          this.animator.addShape(this.shapes[s], true);
        })
      } catch(e){
        alert("Error reading file or file is corrupted")
        console.error(e)
      }
      
    });
    reader.readAsText(file);
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
    if (this.selectedShape) {
      // set properties values to Properties/Editor panal
      this.editor.updatePropertiesValuesDisplay(this.selectedShape);
    }
  }
}
