import App, { FRAME_RATE } from './modules/app.js';

const app = new App()
// add app to global variable
window.app = app


window.setup = function setup() {
	frameRate(FRAME_RATE)
	app.setup()

}

window.draw = function draw() {
	background(255, 255, 255);
	app.draw()
}
