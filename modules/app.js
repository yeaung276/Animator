import Toolbox from './toolbox.js';
import BasicShape from './tools/basicShapeTool.js';

export default class App {
    shapes = {}

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
            obj.draw()
        })
    }

    onMousePressed(posX, posY){
        if(this.toolbox?.selectedTool){
            this.toolbox?.selectedTool?.onDrawStart(posX, posY)
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