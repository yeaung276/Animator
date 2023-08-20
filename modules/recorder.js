import { FRAME_RATE } from "./app.js";

// https://stackoverflow.com/questions/42437971/exporting-a-video-in-p5-js
export class Recorder {
  chunks = [];
  constructor() {
    $("#loading-close").click(() => this.hideLoading())
  }

  setup(canvas) {
    const stream = canvas.canvas.captureStream(FRAME_RATE);
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
        if (e.data.size) {
            this.chunks.push(e.data);
      }
    };
    this.recorder.onstop = () => this.export()
    this.hideLoading()
  }

  start() {
    // start recording
    this.chunks = [];
    this.recorder?.start();
    this.showLoading()
    $("#video").html("Exporting...")
    $("#loading-close").hide()
  }

  stop() {
    this.recorder?.stop();
    $("#video").html("")
    $("#loading-close").show()
  }


  showLoading(){
    $("#loading").show()
  }

  hideLoading(){
    $("#loading").hide()
  }

  export() {
    if(this.chunks.length){
        const blob = new Blob(this.chunks, {type: 'video/webm;codecs=vp8'});
        var vid = document.createElement('video');
        vid.id = 'recorded'
        vid.controls = true;
        vid.src = URL.createObjectURL(blob);
        document.getElementById("video").appendChild(vid);
    }
  }
}
