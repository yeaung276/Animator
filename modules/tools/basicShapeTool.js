import LineShape from "../shape/LineShape.js";
import BaseToolClass from "./baseToolClass.js";

export default class BasicShape extends BaseToolClass {
    name = 'BasicShape'

    icon = 'assets/lineTo.jpg'

    constructor(){
        super()
    }

    createPreview(x, y, x_e, y_e){
        push()
        fill(0,0,0,0)
        stroke(1)
        push()
        drawingContext.setLineDash([5, 5]);
        rect(x,y,x_e-x,y_e-y)
        pop()
        line(x,y,x_e,y_e)
        pop()
    }

    createShape(x, y, x_e, y_e){
        return new LineShape(uuid(),x,y,x_e,y_e)
    }
}