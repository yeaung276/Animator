export default class BaseShapeClass{
    name;

    positionX = 0;
    positionY = 0;

    width = 0;
    height = 0;

    // x, y is the center of the shape
    // h, w are effect width, height of the bounding box
    constructor(name,x,y,h,w){
        this.name = name;
        this.positionX = x;
        this.positionY = y;
        this.height = h;
        this.width = w;
    }

    drawShape(){
        throw Error('Not implemented')
    }

    // function to check the object is clicked or not
    isClicked(mouseX, mouseY){
        if(
            positionX - width/2 < mouseX && 
            positionX + width/2 > mouseX &&
            positionY - height/2 < mouseY &&
            positionY + height/2 > mouseY
        ){
            return true
        }
        return false
    }

    // draw the hightlighted bounding box
    highLight(){
        push()
        drawingContext.setLineDash([5, 5]);
        rect(
            this.positionX - this.width/2,
            this.positionY - this.height/2,
            this.width,
            this.height
        )
        pop()
    }

    // this function is called at each drawing frame
    draw(isHighlighted){
        if(isHighlighted){
            this.highLight()
        }
        this.drawShape()
    }
}