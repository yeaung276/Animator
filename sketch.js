//global variables that will store the toolbox colour palette
//amnd the helper functions
// var toolbox = null;
// var colourP = null;
// var helpers = null;
import App from './modules/app.js';

const app = new App()
var isMouseHold = false


window.setup = function setup() {
	app.setup()
	const slider = createSlider().parent('slider')
	slider.style("width", "100%")
	// //create a canvas to fill the content div from index.html
	// canvasContainer = select('#content');
	// var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	// c.parent("content");

	// //create helper functions and the colour palette
	// helpers = new HelperFunctions();
	// colourP = new ColourPalette();

	// //create a toolbox for storing the tools
	// toolbox = new Toolbox();

	// //add the tools to the toolbox.
	// toolbox.addTool(new FreehandTool());
	// toolbox.addTool(new LineToTool());
	// toolbox.addTool(new SprayCanTool());
	// toolbox.addTool(new mirrorDrawTool());
	// background(255);

}

window.draw = function draw() {
	background(255, 255, 255);
	if(isMouseHold){
		app.onMouseHold(mouseX, mouseY)
	}
	app.onHover(mouseX, mouseY)
	app.draw()
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	// if (toolbox.selectedTool.hasOwnProperty("draw")) {
	// 	toolbox.selectedTool.draw();
	// } else {
	// 	alert("it doesn't look like your tool has a draw method!");
	// }
}

// window.mousePressed = function () {
// 	isMouseHold = true
// 	app.onMousePressed(mouseX, mouseY)
// }

// window.mouseReleased = function () {
// 	isMouseHold = false
// 	app.onMouseRelease(mouseX, mouseY)
// }

// window.mouseDragged = function(){
// 	app.onMouseHold(mouseX, mouseY)
// }

// p5js doubleclick function is not working. So jquery is used
$("#content").dblclick(() => {
	app.onDoubleClicked(mouseX, mouseY)
})