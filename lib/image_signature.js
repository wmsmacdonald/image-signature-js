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

function autoCrop (ndArray) {

   

  /* let rows = listToMatrix(imageData.data, imageData.width)
  let columns = _.zip.apply(_, rows)

  let sumAbsDifferencesOfAdjacent = arr => {
    let pairs = sliding(arr, 2, 1)
    pairs.pop() // remove last element which is single
    let differences =  _.map(pairs, ([a, b]) => Math.abs(a - b))
    return sum(differences)
  }

  let rowSums = _.map(rows, sumAbsDifferencesOfAdjacent)
  let columnSums = _.map(columns, sumAbsDifferencesOfAdjacent)

  let rowSumsTotal = sum(rowsSums)
  let columnSumsTotal = sum(columnSums)

  let rowLowerIndex = weightedPercentile(rowSums, 5)
  let rowUpperIndex = weightedPercentile(rowSums, 95)

  let columnLowerIndex = weightedPercentile(rowSums, 5)
  let columnUpperIndex = weightedPercentile(rowSums, 95)

  let newData = imageData.data.copy()
  return
 */
}

// assumues arr is a square
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

function computeGridSquares (imageData) {

}

function compareLevels (a, b) {

}

module.exports = {
  imageSignature,
  grayscale,
  autoCrop,
  getNeighbors
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

// returns an index
/* function weightedPercentile (array, percentile) {
  let total = sum(array)
  let piece = percentile * 0.01 * total
  let elementsAndIndexes = _.map(array, (el, idx) => [el, idx])
  let sorted = _.sortBy(elementsAndIndexes, ([el, idx]) => el)

  let totalSoFar = 0
  let i = 0
  // second condition for safety
  while (totalSoFar < piece && i < array.length) {
    totalSoFar += sorted[i][0]
    i += 1
  }
  return i
} */
