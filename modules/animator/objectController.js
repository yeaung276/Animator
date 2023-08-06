// https://www.codehim.com/vanilla-javascript/javascript-drag-and-drop-reorder-list/#:~:text=How%20to%20create%20JavaScript%20Drag,elements%20you%20want%20to%20rearrangeable.

export default class ObjectController {
  constructor({ onOrderChange }) {
    this.onOrderChange = onOrderChange;
    this.objectPanel = $("#animation-pane");
  }

  add(shape) {
    this.objectPanel.prepend(
      `<li class="animation-slider" id="${shape.name}" draggable="true"></div>`
    );
    // append drag and drop listeners
    $(`#${shape.name}`)
      .on("drag", (e) => this.handleDrag(e))
      .on("dragend", (e) => this.handleDrop(e));

    // append the name of the object
    $(`#${shape.name}`).append(
      `<div style="width: 100px;overflow: hidden" draggable="false">${shape.name}</div>`
    );
    // append the slider bar to show ticks
    $(`#${shape.name}`).append(
      `<div class="slider shape-slider bg-norm" 
      style="position: relative" 
      id="${shape.name}-slider" draggable="false"></div>`
    );
    this.syncKeyFrame(shape);
  }

  remove(shape) {
    $(`#${shape.name}`).remove();
  }

  updateCurrentTime(time) {
    // update current time tick for all the object
    const width = $(`.shape-slider`).width();
    $(".time-tick").remove();
    $(".shape-slider").append(
      `<div class='time-tick' style='left: ${
        width * (time / 100)
      }px;background-color: red;position: absolute;width: 4px'>.</div>`
    );
  }

  syncKeyFrame(shape) {
    // sync the keyFrame time tick for the given shape in the animator panel
    $(`#${shape.name} .ticks`).remove();
    const width = $(`#${shape.name}-slider`).width();
    Object.keys(shape.keyFrames)
      .sort()
      .forEach((key) => {
        $(`#${shape.name}-slider`).append(
          `<div class='v-line ticks' style='left: ${
            width * (key / 100)
          }px'><img width="20px" src="assets/key-frame.svg"/></div>`
        );
      });
  }

  // These functions are copied from
  // https://www.codehim.com/vanilla-javascript/javascript-drag-and-drop-reorder-list
  handleDrag(item) {
    const selectedItem = item.target;
    const list = selectedItem.parentNode;
    const x = event.clientX;
    const y = event.clientY;

    selectedItem.classList.add("drag-sort-active");
    $(selectedItem).children().addClass("drag-sort-active");
    let swapItem =
      document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode.parentNode) {
      swapItem =
        swapItem !== selectedItem.nextSibling
          ? swapItem.parentNode
          : swapItem.parentNode.nextSibling;
      list.insertBefore(selectedItem, swapItem);
    }
  }

  handleDrop(item) {
    $(".drag-sort-active").removeClass("drag-sort-active");
    // get new object drawing order and update it in the app.drawingOrder
    const newObjOrder = [];
    this.objectPanel
      .children()
      .each((i, c) => newObjOrder.push($(c).attr("id")));
    this.onOrderChange(newObjOrder.reverse())
  }
}
