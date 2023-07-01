import Editor from './editor.js';
import Toolbox from './toolbox.js';
import BasicShape from './tools/basicShapeTool.js';

export default class App {
    shapes = {}

    selectedShape = null

    isMouseHold = false

    constructor(){
        this.content = $('#content');
        this.toolbox = new Toolbox();
        this.editor = new Editor();
    }

    setup(){
        this.toolbox.addTool(new BasicShape())
        this.canvas = createCanvas(this.content.width(), this.content.height());
        this.canvas.parent("content");

        // mouse control logics for click, release and hold
        this.canvas.mousePressed(() => {
            this.isMouseHold = true
            this.onMousePressed(mouseX, mouseY)
        })
        this.canvas.mouseReleased(() => {
            this.isMouseHold = false
            this.onMouseRelease(mouseX, mouseY)
        })

    }

    draw(){
        // controller logics
        if(this.isMouseHold){
            this.onMouseHold(mouseX, mouseY)
        }
        // end of controller logic
        this.editor.selectedShape = this.selectedShape
        Object.values(this.shapes).forEach((obj) => {
            obj.draw(obj.name === this.selectedShape?.name)
        })
    }

    onHover(posX, posY){
        this.editor.hover(posX, posY)
    }

    onMousePressed(posX, posY){
        if(this.selectedShape){
            // invoke editor press if there is selected shape
            this.editor.onPressed(posX, posY)
        }
        if(this.toolbox?.selectedTool && !this.editor.isEditing){
            // invoke drawing code if drawing tool is selected and 
            // there is no editing
            this.toolbox?.selectedTool?.onDrawStart(posX, posY)
        }
    }

    onMouseHold(posX, posY){
        if(this.selectedShape && this.editor.isEditing){
            // if there is shape selected, mouse drag means editing the shape
            this.editor.onDrag(posX, posY)
        }
        if(this.toolbox?.selectedTool && !this.editor.isEditing){
            // invode drawing code if drawing tool is selected and
            // there is no editing
            this.toolbox?.selectedTool?.onDraw(posX, posY)
        }
    }

    onMouseRelease(posX, posY){
        if(this.toolbox?.selectTool && !this.editor.isEditing){
            const shape = this.toolbox?.selectedTool?.onDrawEnd(posX, posY)
            // if drawing tool create a shape, add it to the globe shape object
            shape && (this.shapes[shape.name] = shape)
            // select and highlight the newest draw shape
            this.selectedShape = shape
        }
        if(this.selectedShape){
            this.editor.onRelease(posX, posY)
        }
    }

    onDoubleClicked(x,y){
        const shapes = Object.values(this.shapes).filter((s) => s.isClicked(x,y)).sort();
        this.selectedShape = shapes[0]
        
    }
}