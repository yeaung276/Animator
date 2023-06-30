import Toolbox from './toolbox.js';
import BasicShape from './tools/basicShapeTool.js';

export default class App {
    shapes = {}

    selectedShape = null

    constructor(){
        this.content = $('#content');
        this.toolbox = new Toolbox();
        this.properties = $("#properties");
    }

    setup(){
        this.toolbox.addTool(new BasicShape())
        this.canvas = createCanvas(this.content.width(), this.content.height());
        this.canvas.parent("content");
    }

    draw(){
        Object.values(this.shapes).forEach((obj) => {
            obj.draw(obj.name === this.selectedShape?.name)
        })
    }

    onMousePressed(posX, posY){
        if(this.toolbox?.selectedTool){
            // invoke drawing code if drawing tool is selected
            this.toolbox?.selectedTool?.onDrawStart(posX, posY)
        } else {
            // invoke select tool if drawing tool is not selected
            const shapes = Object.values(this.shapes).filter((s) => s.isClicked(posX, posY))
            this.selectedShape = shapes[0]
        }
    }

    onMouseHold(posX, posY){
        if(this.toolbox?.selectedTool){
            this.toolbox?.selectedTool?.onDraw(posX, posY)
        }
    }

    onMouseRelease(posX, posY){
        if(this.toolbox?.selectTool){
            const shape = this.toolbox?.selectedTool?.onDrawEnd(posX, posY)
            shape && (this.shapes[shape.name] = shape)
        }

    }
}