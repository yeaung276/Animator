// delta time
export default class Animator {
  time = 0;
  isPlaying = false;
  selectedShape = null;

  animationPane = $("#animation-pane");

  constructor(shapes) {
    this.shapes = shapes
  }

  setup() {
    this.slider = createSlider().parent("slider");
    this.slider.style("width", "100%");
    this.slider.value(0);
    this.slider.input(() => this.handleSliderChange());
    $("#play-btn").click(() => (this.isPlaying ? this.pause() : this.play()));
  }

  update() {
    if (this.isPlaying) {
      this.time = this.time + deltaTime / 100;
      this.slider.value(this.time);
      this.updateShapeEditpoints()
      if (this.time > 100) {
        this.pause();
      }
    }
    $(".shape-slider").css("background-color", "#dfdfdf");
    if (this.selectedShape) {
      $(`#${this.selectedShape.name}-slider`).css(
        "background-color",
        "#6699CC"
      );
    }
    $(".selected-time").css("left", `${this.time}%`);
  }

  onEdit(vertices) {
    if (this.selectedShape) {
      const selected = Object.keys(this.selectedShape.keyFrames).find(
        (key) => this.time - 3 < key && this.time + 3 > key
      );
      if(selected){
        this.selectedShape.keyFrames[selected] = _.cloneDeep(vertices)
      } else {
        this.selectedShape.keyFrames[this.time] = _.cloneDeep(vertices)
      }
      this.sync(this.selectedShape)
    }
  }

  sync(shape){
    $(`#${shape.name} .ticks`).remove()
    Object.keys(shape.keyFrames).sort().forEach((key) => {
      this.addTick(shape.name, 'ticks', key)
    })
  }

  play() {
    $("#play-btn").html("Pause");
    this.isPlaying = true;
  }

  pause() {
    $("#play-btn").html("Play");
    this.isPlaying = false;
  }

  handleSliderChange() {
    this.time = this.slider.value();
    this.updateShapeEditpoints()
  }

  updateShapeEditpoints(){
    Object.values(this.shapes).forEach((shape) => {
      shape.editPoints = shape.getEditPoints(this.time)
    })
  }

  addShapeToAnimatorBar(shape) {
    this.animationPane.append(
      `<div class="animation-slider" id="${shape.name}"></div>`
    );
    // append the name of the object
    $(`#${shape.name}`).append(
      `<div style="width: 100px;overflow: hidden">${shape.name}</div>`
    );
    // append the slider bar to show ticks
    $(`#${shape.name}`).append(
      `<div class="slider shape-slider" style="background-color: #dfdfdf;position: relative" id="${shape.name}-slider"></div>`
    );
    // add current time ticks
    this.addTick(shape.name, "selected-time", this.time);
    this.sync(shape)
    shape.keyFrames[0] = shape.editPoints

  }

  addTick(name, identifier, percent) {
    const width = $(`#${name}-slider`).width();
    $(`#${name}-slider`).append(
      `<div class='v-line ${identifier}' style='left: ${
        width * (percent / 100)
      }px'>.</div>`
    );
  }
}
