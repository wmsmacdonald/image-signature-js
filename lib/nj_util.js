'use strict';

const nj = require('../bower_components/numjs/dist/numjs')
const _ = require('underscore')

// https://github.com/numpy/numpy/blob/v1.11.0/numpy/core/numeric.py#L2476-L2515
function array_equals(a1, a2) {
  // shapes and elements are the same
  return _.isEqual(a1.shape, a2.shape) && _.isEqual(a1.flatten(), a2.flatten())
}

// https://github.com/numpy/numpy/blob/v1.10.1/numpy/lib/function_base.py#L1116-L1175
function diff(a, n, axis) {
  // default to 
  n = n === undefined ? 1 : n
  if (n === 0) {
    return a
  }
  if (n < 0) {
    throw new Error('order must be non-negative but got ' + n)
  }
  
  let nd = a.shape.length
  let slice1 = _.map(_.range(nd), el => [null, null, null])
  let slice2 = _.map(_.range(nd), el => [null, null, null])
  // default to last axis
  axis = axis === undefined ? nd - 1 : axis
  slice1[axis] = 1
  slice2[axis] = [null, -1]
  if (n > 1) {
    return diff(a.slice(...slice1).subtract(a.slice(...slice2), n - 1, axis))
  }
  else {
    return a.slice(...slice1).subtract(a.slice(...slice2))
  }
}

module.exports = {
  diff,
  array_equals
}
