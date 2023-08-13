import ObjectController from "./animator/objectController.js";

// delta time
export default class Animator {
  time = 0;
  isPlaying = false;
  selectedShape = null;

  constructor(shapes, displayOrder) {
    this.shapes = shapes;
    this.displayOrder = displayOrder;
    // update the display order of shapes after drag and drop
    this.objectController = new ObjectController({
      onOrderChange: (newOrder) => {
        // update the display order
        this.displayOrder.keys = newOrder;
      },
      onKeyFrameDelete: (name, timeTick) => {
        // delete the keyframe
        if (Object.keys(this.shapes[name]?.keyFrames).length > 1) {
          delete this.shapes[name].keyFrames[timeTick];
          return true;
        }
        alert("You need at least one keyframe to run the app");
        return false;
      },
    });
    $("#play-btn").click(() => this.onPlayBtnClicked());
  }

  setup() {
    // create recording slider
    this.slider = createSlider().parent("slider");
    this.slider.style("width", "100%");
    this.slider.value(0);
    this.slider.input(() => this.handleSliderChange());
  }

  update() {
    if (this.isPlaying) {
      this.advanceTime();
    }
    $(".shape-slider").addClass("bg-norm");
    $(".bg-active").removeClass("bg-active");
    if (this.selectedShape) {
      $(`#${this.selectedShape.name}-slider`).addClass("bg-active");
    }
  }

  onPlayBtnClicked() {
    if (this.isPlaying) {
      this.isPlaying = false;
      $("#play-btn").children().first().attr("src", "assets/play.svg");
    } else {
      this.isPlaying = true;
      $("#play-btn").children().first().attr("src", "assets/pause.svg");
    }
  }

  // advance time when the animator is playing state
  advanceTime() {
    if (this.time < 100) {
      this.time = this.time + deltaTime / 100;
      this.slider.value(this.time);
      this.updateShapeEditpoints();
    } else {
      this.isPlaying = false;
      $("#play-btn").children().first().attr("src", "assets/play.svg");
    }
    this.objectController.updateCurrentTime(this.time);
  }

  updateShapeEditpoints() {
    Object.values(this.shapes).forEach((shape) => {
      shape.currentEditPoints = this.getEditPoints(shape, this.time);
      shape.currentProperties = {
        ...shape.currentProperties,
        ...this.getProperties(shape, this.time),
      };
    });
  }

  handleSliderChange() {
    this.time = this.slider.value();
    this.updateShapeEditpoints();
    this.objectController.updateCurrentTime(this.time);
  }

  /* life cycle methods */
  onShapeEdit(vertices, properties) {
    if (this.selectedShape) {
      const selected = Object.keys(this.selectedShape.keyFrames).find(
        (key) => this.time - 3 < key && this.time + 3 > key
      );
      if (selected) {
        this.selectedShape.keyFrames[selected] = {
          vertices: _.cloneDeep(vertices),
          properties: _.cloneDeep(properties),
        };
      } else {
        this.selectedShape.keyFrames[parseInt(this.time)] = {
          vertices: _.cloneDeep(vertices),
          properties: _.cloneDeep(properties),
        };
      }
      this.objectController.syncKeyFrame(this.selectedShape);
    }
  }

  addShape(shape) {
    shape.keyFrames[parseInt(this.time)] = {
      vertices: shape.currentEditPoints,
      properties: shape.currentProperties,
    };
    this.objectController.add(shape);
  }

  removeShape(shape) {
    delete this.shapes[shape.name];
    this.objectController.remove(shape);
  }

  /* interpolation functions */
  // calculate editPoint at Each timeframe
  getEditPoints(shape, t) {
    const timeTicks = Object.keys(shape.keyFrames).map((x) => parseInt(x, 10));
    timeTicks.sort((a, b) => a - b);
    const nextTickIndex = timeTicks.findIndex(
      (x) => parseInt(x, 10) > parseInt(t)
    );
    const nextTick = timeTicks[nextTickIndex];
    const previousTick = timeTicks[nextTickIndex - 1];

    const interPolatedVertices = [];
    for (var i = 0; i < shape.currentEditPoints.length; i++) {
      const prev = shape.keyFrames[previousTick];
      const next = shape.keyFrames[nextTick];
      if (!next) {
        const vertex = {
          x: shape.keyFrames[timeTicks[timeTicks.length - 1]].vertices[i].x,
          y: shape.keyFrames[timeTicks[timeTicks.length - 1]].vertices[i].y,
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
  getProperties(shape, t) {
    const timeTicks = Object.keys(shape.keyFrames).map((x) => parseInt(x, 10));
    timeTicks.sort((a, b) => a - b);
    const nextTickIndex = timeTicks.findIndex(
      (x) => parseInt(x, 10) > parseInt(t)
    );
    const nextTick = timeTicks[nextTickIndex];
    const previousTick = timeTicks[nextTickIndex - 1];

    let interPolatedProperties = {};
    const prev = shape.keyFrames[previousTick];
    const next = shape.keyFrames[nextTick];
    if (!next) {
      interPolatedProperties =
        shape.keyFrames[timeTicks[timeTicks.length - 1]].properties;
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
}
