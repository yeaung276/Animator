import CircShape from "./shape/circShape.js";
import DrawRecordShape from "./shape/drawRecordShape.js";
import ImageShape from "./shape/imageShape.js";
import LineShape from "./shape/lineShape.js";
import RectShape from "./shape/rectShape.js";
import TrigShape from "./shape/trigShape.js";

// source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
// End of Color convertion functions

export function getMinMaxFromEditPoints(vertices){
    let maxX = 0;
    let minX = 9999;
    let maxY = 0;
    let minY = 9999;
    for (var i = 0; i < vertices.length; i++) {
      maxX = Math.max(maxX, vertices[i].x);
      minX = Math.min(minX, vertices[i].x);
      maxY = Math.max(maxY, vertices[i].y);
      minY = Math.min(minY, vertices[i].y);
    }
    return { maxX, maxY, minX, minY };
}

// Load project functions
export function getShapeBySaveObject(obj){
  // based on type from the saved json project file, dedicated Shape object is returned.
  switch(obj.type){
    case "circle":
      const cshape = new CircShape(obj.name,0,0,0,0)
      cshape.fromSaveFile(obj)
      return cshape
    case "drawRecord":
      const dshape = new DrawRecordShape(obj.name,[])
      dshape.fromSaveFile(obj)
      return dshape
    case "image":
      const ishape = new ImageShape(obj.name,0,0,0,0)
      ishape.fromSaveFile(obj)
      return ishape
    case "line":
      const lshape = new LineShape(obj.name,0,0,0,0)
      lshape.fromSaveFile(obj)
      return lshape
    case "rect":
      const rshape = new RectShape(obj.name,0,0,0,0)
      rshape.fromSaveFile(obj)
      return rshape
    case "trig":
      const tshape = new TrigShape(obj.name,0,0,0,0)
      tshape.fromSaveFile(obj)
      return tshape
  }
}