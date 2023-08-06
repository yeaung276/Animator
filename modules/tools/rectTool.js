import RectShape from "../shape/RectShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class RectTool extends BaseToolClass {
    name = 'RectTool'

    icon = 'assets/lineTo.jpg'

    constructor(){
        super()
    }

    createPreview(x, y, x_e, y_e){
        push()
        fill(0,0,0,0)
        stroke(1)
        drawingContext.setLineDash([5, 5]);
        rect(x,y,x_e-x,y_e-y)
        pop()
    }

    createShape(x, y, x_e, y_e){
        return new RectShape(uuid(),x,y,x_e,y_e)
    }
}