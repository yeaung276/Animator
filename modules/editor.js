import { hexToRGB, rgbToHex } from "./helper.js";

const GRAB = "grab";
const GRABBING = "grabbing";
export default class Editor {
  selectedShape = null;

  isEditing = false;

  isGrabbing = false;

  constructor(animator) {
    this.animator = animator;
    this.strokeStyle = $("#stroke-style");
    this.strokeWeight = $("#stroke-weight");
    this.opacity = $("#opacity");
    this.strokeColor = $("#stroke-color");
    this.fillColor = $("#fill-color");
    // change events
    this.strokeColor.change((e) => {
      if (this.selectedShape) {
        this.selectedShape.currentProperties.strokeColor = hexToRGB(
          e.target.value
        );
      }
    });
    this.strokeWeight.change((e) => {
      if (this.selectedShape) {
        this.selectedShape.currentProperties.strokeWeight = e.target.value;
      }
    });
    this.opacity.change((e) => {
      if (this.selectedShape) {
        this.selectedShape.currentProperties.opacity = map(
          e.target.value,
          1,
          100,
          1,
          255
        );
      }
    });
    this.strokeStyle.change((e) => {
      if (this.selectedShape) {
        this.selectedShape.currentProperties.strokeStyle = e.target.value;
      }
    });
  }

  draw() {
    if (this.selectedShape) {
      const editPoints = this.selectedShape.currentEditPoints;
      push();
      fill(0);
      // draw the edit points if the shape is selected for edit

      editPoints.forEach((v) => {
        rect(v.x - 5, v.y - 5, 10, 10);
      });
      pop();
    }
  }

  updatePropertiesValues(shape) {
    this.strokeStyle.val(shape.currentProperties.strokeStyle);
    this.strokeWeight.val(shape.currentProperties.strokeWeight);
    this.opacity.val(shape.currentProperties.opacity);
    this.strokeColor.val(rgbToHex(...shape.currentProperties.strokeColor));
  }

  // get the vertex the mouse Hover
  getHoverVertex(mouseX, mouseY) {
    const editPoints = this.selectedShape?.currentEditPoints;
    return editPoints.find((v) => dist(v.x, v.y, mouseX, mouseY) < 10);
  }

  // mouse lifecycle events

  onHover(mouseX, mouseY) {
    if (this.selectedShape) {
      // change cursor to multidirection edit icon if hover over vertices
      // of selected shape
      if (this.getHoverVertex(mouseX, mouseY)) {
        // move the vertex
        cursor(MOVE);
      } else if (this.selectedShape.isClicked(mouseX, mouseY)) {
        // move the shape
        cursor(GRAB);
      } else {
        // reset cursor
        cursor(ARROW);
      }
    } else {
      cursor(ARROW);
    }
  }

  onPressed(mouseX, mouseY) {
    // move the vertices
    if (this.selectedShape && this.getHoverVertex(mouseX, mouseY)) {
      this.isEditing = true;
      this.vertex = this.getHoverVertex(mouseX, mouseY);
      // moving the shape
    } else if (
      this.selectedShape &&
      this.selectedShape.isClicked(mouseX, mouseY)
    ) {
      this.isGrabbing = true;
      cursor(GRABBING);
    }
  }

  onDrag(mouseX, mouseY) {
    // dragging the vertices
    if (this.isEditing && this.vertex) {
      this.vertex.x = mouseX;
      this.vertex.y = mouseY;
    }
    // dragging the shape
    if (this.isGrabbing && this.selectedShape) {
      const dX = mouseX - pmouseX;
      const dY = mouseY - pmouseY;
      this.selectedShape.currentEditPoints.forEach((v) => {
        v.x += dX;
        v.y += dY;
      });
    }
  }

  onRelease(mouseX, mouseY) {
    // editing the vertices
    if (this.isEditing && this.vertex) {
      this.isEditing = false;
      this.vertex = null;
      this.animator?.onEdit(this.selectedShape.currentEditPoints);
    }
    // moving the shapes
    if (this.isGrabbing && this.selectedShape) {
      this.isGrabbing = false;
      this.animator?.onEdit(this.selectedShape.currentEditPoints);
    }
  }
}
