export default class BaseShapeClass{
    name;

    positionX = 0;
    positionY = 0;

    width = 0;
    height = 0;

    // x, y is the center of the shape
    // h, w are effect width, height of the bounding box
    constructor(name,x,y,w,h){
        this.name = name;
        this.positionX = x;
        this.positionY = y;
        this.height = h;
        this.width = w;
    }

    // logics for drawing the shape in normal display mode
    drawShapeDisplayMode(){
        throw Error('Not implemented')
    }

    // logics for drawing the shape in edit shape mode
    drawShapeEditMode(){
        throw Error("Not implemented")
    }

    // function to check the object is clicked or not
    isClicked(mouseX, mouseY){
        if(
            this.positionX - this.width/2 < mouseX && 
            this.positionX + this.width/2 > mouseX &&
            this.positionY - this.height/2 < mouseY &&
            this.positionY + this.height/2 > mouseY
        ){
            return true
        }
        return false
    }

    // draw the hightlighted bounding box
    highLight(){
        push()
        drawingContext.setLineDash([5, 5]);
        fill(0,0,0,0)
        rect(
            this.positionX - this.width/2,
            this.positionY - this.height/2,
            this.width,
            this.height
        )
        pop()
    }

    // this function is called at each drawing frame
    draw(isSelected){
        if(isSelected){
            this.highLight()
            this.drawShapeEditMode()
        } else {
            this.drawShapeDisplayMode()
        }
    }
}