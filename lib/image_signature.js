'use strict'

const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')

const njUtil = require('./nj_util')
const func = require('./function_util')

function imageSignature (imageData) {
  let img = nj.images.read(imageData)
  let gray = nj.images.rgb2gray(img)

  let cropped = autoCrop(gray)

  let gridAverages = computeGridAverages(cropped, 10, 10)

  let gridNeighbors = njUtil.vectorize(gridAverages, (avg, idx) => getNeighbors(gridAverages, ...mCoords(idx, ...gridAverages.shape), 1, 1, false))

  let neighborComparisons = _.map(_.zip(squareAverages, neighborGroups), ([avg, neighbors]) => _.map(neighbors(_.partial(compareLevels, avg))))

  return neighborComparisons
}



// rgbaData is a a Uint8ClampedArray from ImageData.data
function grayscale (rgbaData) {
  let rgbArrays = func.sliding(rgbaData, 3, 4)
  let grays = rgbArrays.map(average)
  return grays
}

function autoCrop (gray, lowerPercentile, upperPercentile) {
  // row-wise differences
  const rw = njUtil.cumsum(njUtil.sum(nj.abs(njUtil.diff(gray, undefined, 1)), 1))
  // column-wise differences   
  const cw = njUtil.cumsum(njUtil.sum(nj.abs(njUtil.diff(gray, undefined, 0)), 0))

  const rowTotal = rw.get(-1)
  const colTotal = cw.get(-1)

  const upperRowLimit = njUtil.searchsorted(rw, rowTotal * upperPercentile / 100)
  const lowerRowLimit = njUtil.searchsorted(rw, rowTotal * lowerPercentile / 100)

  const upperColLimit = njUtil.searchsorted(cw, colTotal * upperPercentile / 100)
  const lowerColLimit = njUtil.searchsorted(cw, colTotal * lowerPercentile / 100)

  return gray.slice([lowerRowLimit, upperRowLimit + 1], [lowerColLimit, upperColLimit + 1])
}


function computeGridAverages(imageArray, numBlocksHigh, numBlocksWide) {
  const squareHeight = imageArray.shape[0] / numBlocksHigh
  const squareWidth = imageArray.shape[1] / numBlocksWide

  // resprents width of square in Goldbery paper
  const P = Math.max(2, Math.floor(0.5 + Math.min(imageArray.shape[0], imageArray.shape[1]) / 20))
  // used to calculate the upper and lower offsets of x and y for the edges of the squares
  const upperOffset = Math.ceil((P - 1) / 2)
  const lowerOffset = -Math.floor((P - 1) / 2)

  const gridYs = _.map(_.range(squareHeight / 2, imageArray.shape[0] - 1, squareHeight), Math.floor)
  const gridXs = _.map(_.range(squareWidth / 2, imageArray.shape[1] - 1, squareWidth), Math.floor)

  const flatArray = imageArray.flatten().tolist()

  const gridCoords = cartesianProductOf(gridXs, gridYs)

  const squareAverages = _.map(gridCoords, ([x,y]) => {
    const neighbors = njUtil.getNeighbors(imageArray, y, x, lowerOffset, upperOffset, true)
    return neighbors.mean()
  })

  const array = nj.array(squareAverages)
  // create 3D matrix - first two dimensions represent the square position in the image
  // and the third dimension contains the neighbor values (0 means no neighbor)
  return array.reshape(numBlocksHigh - 1, numBlocksWide - 1)
}

function compareLevels (a, b) {

}

module.exports = {
  imageSignature,
  grayscale,
  autoCrop,
  computeGridAverages
}

// http://stackoverflow.com/a/23823717
function average (arr) {
  return arr.reduce(function (sum, a, i, ar) { sum += a; return i === ar.length - 1 ? (ar.length === 0 ? 0 : sum / ar.length) : sum }, 0)
}

// http://stackoverflow.com/a/12628791
function cartesianProductOf () {
  return _.reduce(arguments, function (a, b) {
    return _.flatten(_.map(a, function (x) {
      return _.map(b, function (y) {
        return x.concat([y])
      })
    }), true)
  }, [ [] ])
}

// returns coords from index into flat array
// rs: num rows, cs: num columns
function mCoords(idx, rs, cs) {
  return [Math.floor(idx / rs), idx % cs]
}
