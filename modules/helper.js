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
