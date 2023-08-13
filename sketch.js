import App from './modules/app.js';

const app = new App()
// add app to global variable
window.app = app


window.setup = function setup() {
	app.setup()

}

window.draw = function draw() {
	background(255, 255, 255);
	app.draw()
}
