'use strict'

const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')

const njUtil = require('./nj_util')

function imageSignature (imageData) {
  let img = nj.images.read(imageData)
  let gray = nj.images.rgb2gray(img)

  let cropped = autoCrop(gray)

  let gridSquares = computeGridSquares(cropped)

  let squareAverages = _.map(gridSquares, average)

  let neighborGroups = _.map(squareAverages, (_, idx, arr) => getNeighbors(idx, arr))

  let neighborComparisons = _.map(_.zip(squareAverages, neighborGroups), ([avg, neighbors]) => _.map(neighbors(_.partial(compareLevels, avg))))

  return neighborComparisons
}

// rgbaData is a a Uint8ClampedArray from ImageData.data
function grayscale (rgbaData) {
  let rgbArrays = sliding(rgbaData, 3, 4)
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

// assumues arr is a square, flattened array in row-major order
function getNeighbors (index, arr) {
  let size = Math.floor(Math.sqrt(arr.length))
  let row = Math.floor(index / size)
  let column = index % size

  let offsets = [-1, 0, 1]
  // array of coordinates representing neighbor offsets
  // ex. [-1, -1], [-1, 0]...
  let possibleOffsets = _.filter(cartesianProductOf(offsets, offsets), ([x, y]) => x !== 0 || y !== 0)
  let neighborsCoords = _.map(possibleOffsets, ([rowOffset, colOffset]) => [row + rowOffset, column + colOffset])
  let validNeighborCoords = _.filter(neighborsCoords, ([r, c]) => r >= 0 && r < size && c >= 0 && c < size)
  // get one dimen array indixes and sort to get TL,T,TR,L,R,BL,B,BR
  let neighborsIndexes = _.map(validNeighborCoords, ([r, c]) => (r * size) + c).sort()

  let neighborValues = _.map(neighborsIndexes, i => arr[i])

  return neighborValues
}

function roundOff(start, end, value) {
  if (value < start) {
    return start
  }
  else if (value > end) {
    return end
  }
  else {
    return value
  }
}

function computeGridSquares(imageArray, numBlocksHigh, numBlocksWide) {
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

  const roundOffRow = _.partial(roundOff, 0, imageArray.shape[0] - 1)
  const roundOffColumn = _.partial(roundOff, 0, imageArray.shape[1] - 1)

  const neighborGroupsFlat = _.map(gridCoords, ([x,y]) => {
    const rowSlice = [roundOffRow(x + lowerOffset), roundOffRow(x + upperOffset) + 1]
    const columnSlice = [roundOffColumn(y + lowerOffset), roundOffColumn(y + upperOffset) + 1]
    const neighbors = imageArray.slice(rowSlice, columnSlice).flatten().tolist()
    return neighbors.concat(_.range(0, (P * P) - neighbors.length).fill(0))
  })

  const array = nj.array(neighborGroupsFlat)
  //console.log(neighborGroupsFlat)
  // create 3D matrix - first two dimensions represent the square position in the image
  // and the third dimension contains the neighbor values (0 means no neighbor)
  return array.reshape(numBlocksHigh - 1, numBlocksWide - 1, P * P)
}

function compareLevels (a, b) {

}

module.exports = {
  imageSignature,
  grayscale,
  autoCrop,
  getNeighbors,
  computeGridSquares
}

function sliding (arr, groupSize, increment) {
  let result = []
  for (let i = 0; i < arr.length; i += increment) {
    let group = arr.slice(i, i + groupSize)
    result.push(group)
  }
  return result
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

function flatMap (arr, fun) {
  return Array.prototype.concat.apply([], arr.map(fun))
}
