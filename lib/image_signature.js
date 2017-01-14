'use strict'

const _ = require('underscore')
const nj = require('../bower_components/numjs/dist/numjs')

const njUtil = require('./nj_util')
const arrayUtil = require('./array_util')

function generate (imageData) {
  const img = nj.array(imageData.data).reshape(imageData.height, imageData.width, 4)
  const gray = nj.images.rgb2gray(img)

  const cropped = autoCrop(gray, 10, 90)

  const gridAverages = computeGridAverages(cropped, 10, 10)
  const flattenedAverages = gridAverages.flatten().tolist()

  const gridNeighbors = _.map(flattenedAverages, (avg, idx) => njUtil.getNeighbors(gridAverages, ...mCoords(idx, ...gridAverages.shape), -1, 1, false))

  const differentialGroups = _.map(_.zip(flattenedAverages, gridNeighbors), ([avg, neighbors]) => _.map(neighbors.flatten().tolist(), neighbor => neighbor - avg))

  const positive = nj.array(_.filter(arrayUtil.flatten(differentialGroups), differential => differential > 2))
  const negative = nj.array(_.filter(arrayUtil.flatten(differentialGroups), differential => differential < -2))

  const positiveCutoff = njUtil.percentile(positive, 50)
  const negativeCutoff = njUtil.percentile(negative, 50)

  const normalizeWithCutoffs = _.partial(normalize, 2, positiveCutoff, negativeCutoff)

  const comparisonGroups = _.map(differentialGroups, differentials => _.map(differentials, normalizeWithCutoffs)) 

  return comparisonGroups
}

// rgbaData is a a Uint8ClampedArray from ImageData.data
function grayscale (rgbaData) {
  let rgbArrays = arrayUtil.sliding(rgbaData, 3, 4)
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

  const gridYs = _.map(_.range(squareHeight, imageArray.shape[0], squareHeight), Math.floor)
  const gridXs = _.map(_.range(squareWidth, imageArray.shape[1], squareWidth), Math.floor)

  const flatArray = imageArray.flatten().tolist()

  const gridCoords = cartesianProductOf(gridXs, gridYs)

  const squares = _.map(gridCoords, ([x,y]) => njUtil.getNeighbors(imageArray, y, x, lowerOffset, upperOffset, true))
  const squareAverages = _.map(squares, s => s.mean())
  const array = nj.array(squareAverages)
  // create 3D matrix - first two dimensions represent the square position in the image
  // and the third dimension contains the neighbor values (0 means no neighbor)
  const reshaped = array.reshape(numBlocksHigh - 1, numBlocksWide - 1)
  return reshaped
}

function normalize (equalCutoff, positiveCutoff, negativeCutoff, value) {
  if (value < -equalCutoff) {
    if (value < negativeCutoff) {
      // much darker
      return -2
    }
    else {
      // darker
      return -1
    }
  }
  else if (value > equalCutoff) {
    if (value > positiveCutoff) {
      // much lighter
      return 2
    }
    else {
      // lighter
      return 1
    }
  }
  // same
  else {
    return 0
  }
}

module.exports = {
  generate,
  grayscale,
  autoCrop,
  normalize,
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
