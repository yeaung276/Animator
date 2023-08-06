import ObjectController from "./animator/objectController.js";

// delta time
export default class Animator {
  time = 0;
  isPlaying = false;
  selectedShape = null;

  constructor(shapes) {
    this.shapes = shapes;
    this.objectController = new ObjectController();
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
    $(".shape-slider").addClass('bg-norm');
    $(".bg-active").removeClass('bg-active')
    if (this.selectedShape) {
      $(`#${this.selectedShape.name}-slider`).addClass('bg-active');
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

  advanceTime() {
    if (this.time < 100) {
      this.time = this.time + deltaTime / 100;
      this.slider.value(this.time);
      this.updateShapeEditpoints();
    } else {
      this.isPlaying = false;
      $("#play-btn").children().first().attr("src", "assets/play.svg");
    }
    $(".selected-time").css("left", `${this.time}%`);
    this.objectController.updateCurrentTime(this.time)
  }

  updateShapeEditpoints() {
    Object.values(this.shapes).forEach((shape) => {
      shape.currentEditPoints = this.getEditPoints(shape, this.time);
      shape.currentProperties = {
        ...shape.currentProperties,
        ...this.getProperties(shape,this.time),
      };
    });
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
        this.selectedShape.keyFrames[this.time] = {
          vertices: _.cloneDeep(vertices),
          properties: _.cloneDeep(properties),
        };
      }
      this.objectController.syncKeyFrame(this.selectedShape);
    }
  }

  handleSliderChange() {
    this.time = this.slider.value();
    this.updateShapeEditpoints();
  }

  addShapeToAnimatorBar(shape) {
    shape.keyFrames[0] = {
      vertices: shape.currentEditPoints,
      properties: shape.currentProperties,
    };
    this.objectController.add(shape)
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
  getProperties(shape,t) {
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
