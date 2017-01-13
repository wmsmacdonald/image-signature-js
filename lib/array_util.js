'use strict';

function flatMap (arr, fun) {
  return Array.prototype.concat.apply([], arr.map(fun))
}

const flatten = arr => [].concat.apply([], arr)

function sliding (arr, groupSize, increment) {
  let result = []
  for (let i = 0; i < arr.length; i += increment) {
    let group = arr.slice(i, i + groupSize)
    result.push(group)
  }
  return result
}


module.exports = {
  flatMap,
  flatten,
  sliding
}
