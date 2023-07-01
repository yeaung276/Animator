export default class Editor{
    selectedShape = null

    isEditing = false

    constructor(){}

    // get the vertex the mouse Hover
    getHoverVertex(mouseX, mouseY){
        return this.selectedShape.vertices.find((v) => dist(v.x, v.y, mouseX, mouseY) < 10)
    }

    hover(mouseX, mouseY){
        if(this.selectedShape){
            // change cursor to multidirection edit icon if hover over vertices
            // of selected shape
            if(this.getHoverVertex(mouseX, mouseY)){
                cursor(MOVE);
            } else{
                cursor(ARROW);
            }
        } else{
            cursor(ARROW)
        }
    }

    onPressed(mouseX, mouseY){
        if(this.selectedShape && this.getHoverVertex(mouseX, mouseY)){
            this.isEditing = true
            this.vertex = this.getHoverVertex(mouseX, mouseY)
        }
    }

    onDrag(mouseX, mouseY){
        if(this.isEditing && this.vertex){
            this.vertex.x = mouseX
            this.vertex.y = mouseY
        }
    }

    onRelease(mouseX, mouseY){
        if(this.isEditing && this.vertex){
            this.isEditing = false
            this.vertex = null
        }
    }
}