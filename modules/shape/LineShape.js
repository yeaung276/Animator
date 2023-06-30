import BaseShapeClass from "./BaseShapeClass.js"

export default class LineShape extends BaseShapeClass{
    constructor(name, x, y, x_e, y_e){
        super(name, (x+x_e)/2, (y+y_e)/2, x_e-x, y_e-y)
        this.x = x
        this.y = y
        this.x_e = x_e
        this.y_e = y_e
    }

    drawShapeDisplayMode(){
        push()
        stroke(1)
        line(this.x, this.y, this.x_e, this.y_e)
        pop()
        fill(0)
    }

    drawShapeEditMode(){
        push()
        stroke(1)
        line(this.x, this.y, this.x_e, this.y_e)
        rect(this.x - 5, this.y - 5, 10, 10)
        rect(this.x_e - 5, this.y_e - 5, 10, 10)
        pop()
    }
}