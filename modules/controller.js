// Abstract away keyboard and mouse actions
export default class Controller {
  isMouseKeyPressed = false;

  constructor() {}

  setup(canves) {
    this.canves = canves;
  }

  update() {
    if (this.isMouseKeyPressed) {
      this.dragFn?.(mouseX, mouseY);
    } else {
      this.hoverFn?.(mouseX, mouseY);
    }
  }

  // Event listener setup function
  onMousePressed(fn) {
    this.canves.mousePressed(() => {
      this.isMouseKeyPressed = true;
      fn(mouseX, mouseY);
    });
  }

  onMouseReleased(fn) {
    this.canves.mouseReleased(() => {
      this.isMouseKeyPressed = false;
      fn(mouseX, mouseY);
    });
  }

  onDoubleClicked(fn) {
    this.canves.doubleClicked(() => {
      fn(mouseX, mouseY);
    });
  }

  onMouseDragged(fn) {
    this.dragFn = fn;
  }

  onHover(fn) {
    this.hoverFn = fn;
  }
}
