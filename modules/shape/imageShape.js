import { getMinMaxFromEditPoints } from "../helper.js";
import BaseShapeClass from "./baseShapeClass.js";

export default class ImageShape extends BaseShapeClass {
  type = "image";

  image = null;

  constructor(name, x, y, x_e, y_e, imageURL) {
    super(name, [
        { x: (x + x_e) / 2, y: Math.min(y, y_e) },
        { x: (x + x_e) / 2, y: Math.max(y, y_e) },
        { x: Math.min(x, x_e), y: (y + y_e) / 2 },
        { x: Math.max(x, x_e), y: (y + y_e) / 2 },
    ]);
    if(imageURL){
      this.loadImage(imageURL);
    }
  }

  loadImage(url) {
    this.imgUrl = url
    loadImage(url, (img) => (this.image = img));
  }

  // image has different logic of calculating currentEditPoint 
  // then the rest. So this function is polymorphed
  onEdit() {
    const { minX, maxX, minY, maxY } = getMinMaxFromEditPoints(
      this.currentEditPoints
    );
    this.currentEditPoints = [
        { x: (minX + maxX) / 2, y: minY },
        { x: (minX + maxX) / 2, y: maxY },
        { x: minX, y: (minY + maxY) / 2 },
        { x: maxX, y: (minY + maxY) / 2 },
    ];
  }

  // use polymorphism to overwrite the unimplemented drawShape function
  drawShape(vertices) {
    const { maxX, maxY, minX, minY } = getMinMaxFromEditPoints(vertices);
    if (this.image) {
      image(this.image, minX, minY, maxX - minX, maxY - minY);
    }
  }

  // deserialization of image base64 encoded string.
  fromSaveFile(obj){
    super.fromSaveFile(obj)
    this.loadImage(obj.imageUrl)
  }

  // serialization of image base64 encoded string
  toJsonObj(){
    return {
      ...super.toJsonObj(),
      imageUrl: this.imgUrl
    }
  }
}
