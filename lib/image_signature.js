'use strict';

function imageSignature(imageData) {
  let grays = grayscale(imageData.data);

  let cropped = autoCrop({ data: grays, width: imageData.width, height: imageData.height});

  let smoothed = smooth(cropped);
  
  let gridPoints = computeGridPoints(smoothed);

  let neighborComparisons = gridPoints.map(([x, y]) => average(
}

// rgbaData is a a Uint8ClampedArray from ImageData.data
function grayscale(rgbaData) {
  let rgbArrays = sliding(rgbaData, 3, 4);
  let grays = rgbArrays.map(average); 
  return grays;
}

function autoCrop(imageData) {

}

function smooth(imageData) {

}

function getNeighb

function getNeighborLevels(imageData, xCoord, yCoord) {

}

function computeGridPoints(imageData) {


}


module.exports = {
  imageSignature,
  grayscale,
  crop,
  computeGridPoints
}


function sliding(arr, groupSize, increment) {
  let result = [];
  for (let i = 0; i < arr.length; i += increment) {
    let group = arr.slice(i, i + groupSize);
    result.push(group);
  }
  return result;
}

// http://stackoverflow.com/a/23823717
function average(arr) {
  return arr.reduce(function(sum, a,i,ar) { sum += a;  return i==ar.length-1?(ar.length==0?0:sum/ar.length):sum},0);
}
